use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct CreateAccessTokenReq {
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub name: String,

    #[validate(range(min = 1, max = 20))]
    pub age: i32,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginReq {
    #[validate(length(min = 5))]
    pub username: String,

    #[validate(length(min = 8, max = 20))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterReq {
    #[validate(length(min = 5))]
    pub username: String,

    #[validate(length(min = 8, max = 20))]
    pub password: String,

    #[validate(email)]
    pub email: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterSuperUserReq {
    #[validate(length(min = 1, message = "Can not be empty"))]
    pub name: String,

    #[validate(range(min = 1, max = 20))]
    pub age: i32,
}
