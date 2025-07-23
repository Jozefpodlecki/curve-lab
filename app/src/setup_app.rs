use anyhow::*;
use chrono::Utc;
use log::*;
use serde::{Deserialize, Serialize};
use sqlx::{Sqlite, migrate::MigrateDatabase, sqlite::SqlitePoolOptions};
use tokio::{sync::Mutex, time::{sleep, Sleep}};
use uuid::Uuid;
use std::{sync::Arc, time::Duration};
use tauri::{App, AppHandle, Emitter, EventTarget, Listener, Manager};
use tauri_plugin_updater::UpdaterExt;

use crate::{models::{AppContext, UpdateCheckResult}, services::AppReadyState};

pub fn setup_app(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let app_handle = app.handle();
    let window= app_handle.get_webview_window("main").unwrap();

    let package_info = app_handle.package_info();
    let app_name = package_info.name.clone();
    let version = package_info.version.to_string();

    let loaded_on = Utc::now();
    let app_context = AppContext {
        id: Uuid::now_v7(),
        app_name,
        github_link: env!("CARGO_PKG_REPOSITORY").to_string(),
        loaded_on,
        updated_on: loaded_on,
        version,
        update_check_result: UpdateCheckResult::Checking,
        updater: None
    };
    let app_context: Arc<Mutex<AppContext>> = Arc::new(Mutex::new(app_context));

    app.manage(app_context.clone());

    let title = format!("{} v{}", package_info.name, package_info.version);
    window.set_title(&title).unwrap();

    window.maximize()?;
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }

    let app_ready_state = Arc::new(AppReadyState::new());
    app_handle.manage(app_ready_state.clone());

    let app_handle = app_handle.clone();

    tokio::spawn(async move {

        {
           let cloned = app_handle.clone();
            app_handle.listen_any("update-confirm", move |_| {
            tokio::spawn({
                let cloned = cloned.clone();
                async move {
                    let app_context = cloned.state::<Arc<Mutex<AppContext>>>();
                    let app_context = app_context.lock().await;

                    let updater = app_context.updater.as_ref().unwrap();
                    updater.download_and_install(|_, _| {}, || {}).await.unwrap();
                    cloned.restart();
                }});
            });
        }

        check_updates(app_context, app_ready_state, app_handle.clone()).await?;

        if let Err(err) = setup_db(app_handle).await {
            error!("{}", err);
        }

        Ok(())
    });

    std::result::Result::Ok(())
}

async fn check_updates(
    app_context: Arc<Mutex<AppContext>>,
    app_ready_state: Arc<AppReadyState>,
    app: AppHandle) -> Result<()> {
    app_ready_state.wait_for_ready().await;
    let mut app_context = app_context.lock().await;
    let update_check_interval = Duration::from_secs(600);
    let mut is_initial = true;

    loop {
        let updates = app.updater()?.check().await.ok().flatten();
        match updates {
            Some(update) => {
                info!("{} {}", update.current_version, update.version);

                if is_initial {
                    let result = UpdateCheckResult::NewVersion(update.version.clone());
                    app.emit("update-check", &result)?;
                    app_context.updated_on = Utc::now();
                    app_context.update_check_result = result;

                    sleep(Duration::from_secs(2)).await;

                    update.download_and_install(|_, _| {}, || {}).await?;
                    app.restart();
                }
                else {
                    let result = UpdateCheckResult::NewVersionOptional(update.version.clone());
                    app.emit("update-check", &result)?;
                    app_context.updated_on = Utc::now();
                    app_context.update_check_result = result;
                    app_context.updater = Some(update);

                    break;
                }
            },
            None => {
                let result = UpdateCheckResult::Latest;
                app.emit("update-check", &result)?;
                app_context.updated_on = Utc::now();
                app_context.update_check_result = result
            },
        }   

        sleep(update_check_interval).await;
        is_initial = true;
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
