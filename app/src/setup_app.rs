use anyhow::*;
use chrono::Utc;
use log::*;
use serde::{Deserialize, Serialize};
use sqlx::{Sqlite, migrate::MigrateDatabase, sqlite::SqlitePoolOptions};
use tokio::time::sleep;
use uuid::Uuid;
use std::{sync::Arc, time::Duration};
use tauri::{App, AppHandle, Emitter, EventTarget, Manager};
use tauri_plugin_updater::UpdaterExt;

use crate::{models::AppContext, services::AppReadyState};

pub fn setup_app(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let window= app.get_webview_window("main").unwrap();

    let package_info = app.package_info();
    let app_name = package_info.name.clone();
    let version = package_info.version.to_string();

    let app_context = AppContext {
        id: Uuid::now_v7(),
        app_name,
        github_link: env!("CARGO_PKG_REPOSITORY").to_string(),
        loaded_on: Utc::now(),
        version,
    };

    app.manage(app_context);

    let title = format!("{} v{}", package_info.name, package_info.version);
    window.set_title(&title).unwrap();

    window.maximize()?;
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }
    

    let app_ready_state = Arc::new(AppReadyState::new());
    app.manage(app_ready_state.clone());

    let app = app.handle().clone();

    tokio::spawn(async move {
        check_updates(app_ready_state, app.clone()).await?;

        if let Err(err) = setup_db(app).await {
            error!("{}", err);
        }

        Ok(())
    });

    std::result::Result::Ok(())
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", content = "version")]
enum UpdateCheckResult {
    Latest,
    NewVersion(String)
}

async fn check_updates(app_ready_state: Arc<AppReadyState>, app: AppHandle) -> Result<()> {
    app_ready_state.wait_for_ready().await;
    let updates = app.updater()?.check().await.ok().flatten();

    match updates {
        Some(update) => {
            info!("{} {}", update.current_version, update.version);

            app.emit("update", UpdateCheckResult::NewVersion(update.version.clone()))?;

            sleep(Duration::from_secs(2)).await;

            update.download_and_install(|_, _| {}, || {}).await?;
            app.restart();
        },
        None => {
            app.emit("update", UpdateCheckResult::Latest)?;
        },
    }

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
