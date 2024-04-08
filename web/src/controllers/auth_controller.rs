use crate::app_state::AppState;
use crate::dtos::{LoginReq, RegisterReq};
use axum::{extract::State, Json};
use entity::user;
use hyper::StatusCode;
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter};
use serde_json::json;
use web::{
    ApiResult,
    JsonResp,
    // Pagination,
    VJson,
};

pub async fn login(
    State(app_state): State<AppState>,
    VJson(body): VJson<LoginReq>,
) -> ApiResult<serde_json::Value> {
    let user = user::Entity::find()
        .filter(
            Condition::all()
                .add(user::Column::Username.eq(body.username))
                .add(user::Column::Password.eq(body.password)),
        )
        .into_json()
        .one(&app_state.db)
        .await?;

    match user {
        Some(u) => Ok(JsonResp {
            code: StatusCode::OK,
            data: Some(json!(u)),
            message: None,
            pagination: None,
        }),
        None => Ok(JsonResp {
            code: StatusCode::NOT_FOUND,
            data: None,
            message: Some("Not found user".to_owned()),
            pagination: None,
        }),
    }
}

pub async fn register(VJson(body): VJson<RegisterReq>) -> Json<String> {
    println!("❤❤❤ tuannm: [controller.rs][28][input]: {:?}", body);
    Json("ahii".to_owned())
}

pub async fn register_super_user() {}

pub async fn logout() {}
