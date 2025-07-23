use std::sync::Arc;

use tauri::{AppHandle, State, command};
use tokio::sync::Mutex;

use crate::{error::AppError, models::{AppContext, LoadResult}, services::AppReadyState};

#[command]
pub async fn load<'a>(
    app_ready_state: State<'a, Arc<AppReadyState>>,
    app_context: State<'a, Arc<Mutex<AppContext>>>,
) -> Result<LoadResult, AppError> {
    app_ready_state.mark_ready();
    let app_context = app_context.lock().await;

    let result = LoadResult {
        id: app_context.id,
        app_name: app_context.app_name.clone(),
        github_link: app_context.github_link.clone(),
        loaded_on: app_context.loaded_on,
        version: app_context.version.clone(),
        update_check_result: app_context.update_check_result.clone()
    };

    Ok(result)
}
