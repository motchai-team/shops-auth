use oauth2::basic::BasicClient;
use oauth2::reqwest;
use oauth2::{AuthUrl, ClientId, ClientSecret, RedirectUrl, RevocationUrl, TokenUrl};

use super::strategy::{AuthStrategy, BasicAuthStrategy, OAuth2GoogleStrategy};
use std::env;

pub async fn login(auth_type: &str) {
    let auth_strategy: Box<dyn AuthStrategy> = match auth_type {
        "basic" => Box::new(BasicAuthStrategy),
        "oauth2-google" => Box::new(OAuth2GoogleStrategy),
        _ => {
            panic!("Unsupported auth type");
        }
    };

    auth_strategy.authenticate();
}

pub async fn google_login() {
    let google_client_id = ClientId::new(
        env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID environment variable."),
    );
    let google_client_secret = ClientSecret::new(
        env::var("GOOGLE_CLIENT_SECRET")
            .expect("Missing the GOOGLE_CLIENT_SECRET environment variable."),
    );
    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
        .expect("Invalid authorization endpoint URL");
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
        .expect("Invalid token endpoint URL");

    // Set up the config for the Google OAuth2 process.
    let client = BasicClient::new(
        google_client_id,
        Some(google_client_secret),
        AuthUrl::new("http://auth".to_string()).expect("blah"),
        Some(token_url),
    )
    .set_redirect_uri(
        RedirectUrl::new("http://localhost:8080/api/v1/auth/google/callback".to_string()).expect("Invalid redirect URL"),
    );

}
