use sea_orm::*;
use std::time::Duration;

pub async fn set_up_db(database_url: &str) -> Result<DatabaseConnection, DbErr> {
    let mut opt = ConnectOptions::new(database_url.to_owned());
    opt.max_connections(100)
        .sqlx_logging(false)
        .connect_timeout(Duration::from_secs(10))
        .idle_timeout(Duration::from_secs(10));

    let db = Database::connect(opt).await?;

    Ok(db)
}
