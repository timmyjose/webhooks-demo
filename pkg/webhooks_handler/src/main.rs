use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use log::info;
use oauth_fcm::{
    create_shared_token_manager, send_fcm_message, FcmNotification,
};
use serde::{Deserialize, Serialize};
use std::{env, fs::File};

#[derive(Serialize)]
pub struct FCMNotificationMessage {
    message: String,
}

async fn send_notification_route(user: web::Json<UserPayload>) {
    let fcm_project_id = env::var("FCM_PROJECT_ID").expect("failed to read FCM_PROJECT_ID");
    info!("FCM_PROJECT_ID = {fcm_project_id}");

    let fcm_device_token = env::var("FCM_DEVICE_TOKEN").expect("failed to read FCM_DEVICE_TOKEN");
    info!("FCM_DEVICE_TOKEN = {fcm_device_token}");

    let fcm_credentials_json_path =
        env::var("FCM_CREDENTIALS_JSON_PATH").expect("failed to read FCM_CREDENTIALS_JSON_PATH");
    info!("FCM_CREDENTIALS_JSON_PATH = {fcm_credentials_json_path}");

    let shared_token_manager = create_shared_token_manager(
        File::open(fcm_credentials_json_path).expect("Could not find credentials json"),
    )
    .unwrap();

    let data = FCMNotificationMessage {
        message: format!("Name: {}, Age: {}", user.name, user.age.to_string())
    };

    let notification = FcmNotification {
        title: "User Registration".to_string(),
        body:  "User registered successfully ".to_string(), 
    };
    send_fcm_message(
        &fcm_device_token,
        Some(notification),
        Some(data),
        &shared_token_manager,
        &fcm_project_id,
    )
    .await
    .unwrap();
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserPayload {
    pub name: String,
    pub age: i32,
}


#[post("/webhook")]
async fn handle_webhooks(user: web::Json<UserPayload>) -> impl Responder {
    info!("Received a request to register user: {user:#?}");
    send_notification_route(user).await;
    HttpResponse::Ok().body("Webhook handled")
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    env_logger::init();
    dotenvy::dotenv()?;

    info!("Starting up WebHooks Handler server on port 8000");

    Ok(HttpServer::new(move || App::new().service(handle_webhooks))
        .bind(("127.0.0.1", 8000))?
        .run()
        .await?)
}
