use anyhow::*;
use log::*;
use sqlx::{Sqlite, migrate::MigrateDatabase, sqlite::SqlitePoolOptions};
use std::sync::Arc;
use tauri::{App, AppHandle, Manager};
use tauri_plugin_updater::UpdaterExt;

use crate::services::AppReadyState;

#[cfg(debug_assertions)]
fn open_devtools(window: tauri::WebviewWindow) {
    window.open_devtools();
}

#[cfg(not(debug_assertions))]
fn open_devtools(window: tauri::WebviewWindow) {
}

pub fn setup_app(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let window= app.get_webview_window("main").unwrap();

    window.maximize()?;
    open_devtools(window);

    let app_ready_state = Arc::new(AppReadyState::new());
    app.manage(app_ready_state);

    let app = app.handle().clone();

    tokio::spawn(async move {
        check_updates(app.clone()).await?;

        if let Err(err) = setup_db(app).await {
            error!("{}", err);
        }

        Ok(())
    });

    std::result::Result::Ok(())
}

async fn check_updates(app: AppHandle) -> Result<()> {
    let updates = app.updater()?.check().await.ok();

    Ok(())
}

async fn setup_db(app: AppHandle) -> Result<()> {
    debug!("Current dir: {:?}", std::env::current_dir()?);
    let connection_string = "sqlite://curve_lab.db";
    let database_exists = Sqlite::database_exists(connection_string)
        .await
        .unwrap_or(false);

    if !database_exists {
        Sqlite::create_database(connection_string).await?;
    }

    let pool: sqlx::Pool<sqlx::Sqlite> = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(connection_string)
        .await?;

    sqlx::migrate!().run(&pool).await?;

    anyhow::Ok(())
}
