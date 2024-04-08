use axum::response::{Html, IntoResponse};
use axum::{routing, Router};
use crate::app_state::AppState;
use crate::controllers::auth_controller;


pub fn create_router() -> Router<AppState> {
    Router::new()
        .route("/ping", routing::get(ping_handler))
        .nest("/api/v1", Router::new().merge(auth_router()))
}

async fn ping_handler() -> impl IntoResponse {
    Html("<h1>Pong!</h1>".to_string())
}

fn auth_router() -> Router<AppState> {
    Router::new().nest(
        "/auth",
        Router::new()
            .route("/login", routing::post(auth_controller::login))
            .route("/logout", routing::post(auth_controller::logout))
            .route("/register", routing::post(auth_controller::register))
            .route(
                "/register/super-user",
                routing::post(auth_controller::register_super_user),
            ),
    )
}
