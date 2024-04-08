use std::env;

use axum::response::IntoResponse;
use dotenvy::dotenv;
use hyper::StatusCode;
use std::time::Duration;
use tokio::{net::TcpListener, signal};
use tower_http::cors::{Any, CorsLayer};
use tower_http::timeout::TimeoutLayer;
use tower_http::trace::TraceLayer;

mod app_state;
mod app_route;
mod connections;
mod services;
mod helpers;
mod controllers;
mod dtos;

#[tokio::main]
pub async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or("postgres://minhtuan:SecurePassword@127.0.0.1:5432/postgres".to_owned());
    let port = env::var("PORT").unwrap_or("3000".to_owned());

    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    let db = match connections::postgres::set_up_db(database_url.as_str()).await {
        Ok(db) => {
            tracing::info!("Connected to database success.");
            db
        }
        Err(error) => {
            tracing::error!("Error while connecting to the database. Error: {:?}", error);
            panic!();
        }
    };

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();

    tracing::info!("App running on port {}", port);

    let cors = CorsLayer::new()
        // .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_origin(Any);

    let routers = app_route::create_router()
        .with_state(app_state::AppState { db })
        .layer((
            TraceLayer::new_for_http(),
            TimeoutLayer::new(Duration::from_secs(30)),
            cors,
        ))
        .fallback(handler_404);

    axum::serve(listener, routers)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap()
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Nothing to see here...")
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
        tracing::info!("App shutting down...");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
        tracing::info!("App shutting down by signal...");
    };
    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
