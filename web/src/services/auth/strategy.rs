use async_trait::async_trait;

// Using Strategy design pattern for implement Login base on type of auth
#[async_trait]
pub trait AuthStrategy {
    async fn authenticate(&self);

    async fn validate(&self);
}

pub struct BasicAuthStrategy;

#[async_trait]
impl AuthStrategy for BasicAuthStrategy {
    async fn authenticate(&self) {
        println!("Authenticating using Basic Auth");
    }

    async fn validate(&self) {
        todo!()
    }
}

pub struct OAuth2GoogleStrategy;

#[async_trait]
impl AuthStrategy for OAuth2GoogleStrategy {
    async fn authenticate(&self) {
        println!("Authenticating using OAuth2 Google");
    }

    async fn validate(&self) {
        todo!()
    }
}
