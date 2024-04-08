use axum::{
    extract::{
        rejection::{FormRejection, JsonRejection, QueryRejection},
        FromRequest, Request,
    },
    response::{IntoResponse, Response},
    Form, Json,
};
use hyper::StatusCode;
use serde::{de::DeserializeOwned, Serialize};
use serde_json::json;
use thiserror::Error;
use validator::Validate;


// implementation for custom response or error response as json
#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(AppError))]
pub struct ErrJsonResp<T>(pub T);

impl<T> IntoResponse for ErrJsonResp<T>
where
    axum::Json<T>: IntoResponse,
{
    fn into_response(self) -> Response {
        axum::Json(self.0).into_response()
    }
}

#[derive(Debug, Error)]
pub enum AppError {
    // #[error(transparent)]
    // StdErr(#[from] std::error::Error),
    #[error(transparent)]
    ValidationError(#[from] validator::ValidationErrors),

    #[error(transparent)]
    DbError(#[from] sea_orm::DbErr),

    #[error(transparent)]
    AxumFormRejection(#[from] FormRejection),

    #[error(transparent)]
    AxumJsonRejection(#[from] JsonRejection),

    #[error(transparent)]
    AxumQueryRejection(#[from] QueryRejection),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        #[derive(Serialize)]
        enum ErrorDetail {
            ValidationErrors(validator::ValidationErrors),
        }

        #[derive(Serialize)]
        struct Res {
            message: String,
            #[serde(skip_serializing_if = "Option::is_none")]
            detail: Option<ErrorDetail>,
        }

        let (status, message, detail) = match self {
            AppError::AxumJsonRejection(rejection) => {
                (rejection.status(), rejection.body_text(), None)
            }
            AppError::AxumFormRejection(rejection) => {
                (rejection.status(), rejection.body_text(), None)
            }
            AppError::AxumQueryRejection(rejection) => {
                (rejection.status(), rejection.body_text(), None)
            }
            AppError::ValidationError(errors) => (
                StatusCode::BAD_REQUEST,
                "Validation error".to_owned(),
                Some(ErrorDetail::ValidationErrors(errors)),
            ),
            AppError::DbError(error) => {
                (StatusCode::INTERNAL_SERVER_ERROR, error.to_string(), None)
            }
        };

        (status, ErrJsonResp(Res { message, detail })).into_response()
    }
}

// form validation
#[derive(Debug, Clone, Copy, Default)]
pub struct VForm<T>(pub T);

#[async_trait::async_trait]
impl<T, S> FromRequest<S> for VForm<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
    Form<T>: FromRequest<S, Rejection = FormRejection>,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Form(value) = Form::<T>::from_request(req, state).await?;
        value.validate()?;
        Ok(VForm(value))
    }
}

// json validation
#[derive(Debug, Clone, Copy, Default)]
pub struct VJson<T>(pub T);

#[async_trait::async_trait]
impl<T, S> FromRequest<S> for VJson<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
    Json<T>: FromRequest<S, Rejection = JsonRejection>,
{
    type Rejection = AppError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Json(value) = Json::<T>::from_request(req, state).await?;
        value.validate()?;
        Ok(VJson(value))
    }
}

pub type ApiResult<T> = Result<JsonResp<T>, AppError>;

#[derive(Serialize)]
pub struct Pagination {
    pub total: u32,
    pub page: u32,
}

// implementation for custom response and status
pub struct JsonResp<T> {
    pub code: StatusCode,
    pub data: Option<T>,
    pub message: Option<String>,
    pub pagination: Option<Pagination>,
}

impl<T> IntoResponse for JsonResp<T>
where
    axum::Json<T>: IntoResponse,
    T: serde::Serialize + Send + Sync,
{
    fn into_response(self) -> Response {
        let (code, data) = match serde_json::to_value(&self.data) {
            Ok(data) => {
                let mut json_obj = json!({
                    "code": self.code.as_u16(),
                    "data": data,
                });

                if let Some(pagination) = self.pagination {
                    json_obj["pagination"] = json!(pagination);
                }

                if let Some(mess) = self.message {
                    json_obj["message"] = json!(mess);
                }

                (self.code, json_obj)
            }
            Err(error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                json!({
                    "code": StatusCode::INTERNAL_SERVER_ERROR.as_u16(),
                    "message": error.to_string()
                }),
            ),
        };

        (code, axum::Json(data)).into_response()
    }
}
