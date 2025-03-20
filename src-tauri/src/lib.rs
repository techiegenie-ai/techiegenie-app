// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::env;
use tauri::Runtime;

// Command to get the default shell
#[tauri::command]
fn get_shell() -> String {
    if cfg!(windows) {
        env::var("COMSPEC").unwrap_or_else(|_| "cmd.exe".to_string())
    } else {
        env::var("SHELL").unwrap_or_else(|_| "/bin/sh".to_string())
    }
}

// Command to get the username
#[tauri::command]
fn get_username() -> String {
    if cfg!(windows) {
        env::var("USERNAME").unwrap_or_else(|_| "unknown".to_string())
    } else {
        env::var("USER").unwrap_or_else(|_| "unknown".to_string())
    }
}

// Command to get ENVIRONMENT_ENDPOINT
#[tauri::command]
async fn get_endpoint<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _window: tauri::Window<R>,
) -> Result<String, String> {
    env::var("ENVIRONMENT_ENDPOINT").or(Ok(
        "https://tmt6sji6nprxnx4fcfa3iznkce0fwdla.lambda-url.us-east-1.on.aws".to_string(),
    ))
}

// Command to get the platform (e.g., "windows", "linux", "macos")
#[tauri::command]
fn get_platform() -> String {
    if cfg!(windows) {
        "windows".to_string()
    } else if cfg!(target_os = "macos") {
        "macos".to_string()
    } else if cfg!(target_os = "linux") {
        "linux".to_string()
    } else {
        "unknown".to_string()
    }
}

// Command to get the OS type (e.g., "Windows_NT", "Linux", "Darwin")
#[tauri::command]
fn get_os_type() -> String {
    if cfg!(windows) {
        "Windows_NT".to_string()
    } else if cfg!(target_os = "macos") {
        "Darwin".to_string()
    } else if cfg!(target_os = "linux") {
        "Linux".to_string()
    } else {
        "Unknown".to_string()
    }
}

// Command to get the architecture (e.g., "x86_64", "arm64")
#[tauri::command]
fn get_arch() -> String {
    std::env::consts::ARCH.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![
            get_shell,
            get_username,
            get_endpoint,
            get_platform,
            get_os_type,
            get_arch
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
