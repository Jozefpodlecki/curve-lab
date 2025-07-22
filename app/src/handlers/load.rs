use std::sync::Arc;

use chrono::Utc;
use tauri::{AppHandle, State, command};
use uuid::Uuid;

use crate::{error::AppError, models::{AppContext, LoadResult}, services::AppReadyState};

#[command]
pub async fn load<'a>(
    app_ready_state: State<'a, Arc<AppReadyState>>,
    app_context: State<'a, AppContext>,
) -> Result<LoadResult, AppError> {
    app_ready_state.mark_ready();

    let result = LoadResult {
        id: app_context.id,
        app_name: app_context.app_name.clone(),
        github_link: app_context.github_link.clone(),
        loaded_on: app_context.loaded_on,
        version: app_context.version.clone(),
    };

    Ok(result)
}
