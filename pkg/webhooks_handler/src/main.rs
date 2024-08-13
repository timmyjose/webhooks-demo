use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct UserPayload {
    pub name: String,
    pub age: i32,
}

#[post("/webhook")]
async fn handle_webhooks(user: web::Json<UserPayload>) -> impl Responder {
    println!("Got a user: {user:#?}");
    HttpResponse::Ok().body("Webhook handled")
}

#[tokio::main]
async fn main() -> eyre::Result<()> {
    Ok(HttpServer::new(move || App::new().service(handle_webhooks))
        .bind(("127.0.0.1", 8000))?
        .run()
        .await?)
}
