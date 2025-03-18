// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Runtime};
use std::env;

// Command to get the default shell
#[command]
fn get_shell() -> String {
    if cfg!(windows) {
        env::var("COMSPEC").unwrap_or_else(|_| "cmd.exe".to_string())
    } else {
        env::var("SHELL").unwrap_or_else(|_| "/bin/sh".to_string())
    }
}

// Command to get the username
#[command]
fn get_username() -> String {
    if cfg!(windows) {
        env::var("USERNAME").unwrap_or_else(|_| "unknown".to_string())
    } else {
        env::var("USER").unwrap_or_else(|_| "unknown".to_string())
    }
}

// Command to get ENVIRONMENT_ENDPOINT
#[command]
async fn get_endpoint<R: Runtime>(_app: tauri::AppHandle<R>, _window: tauri::Window<R>) -> Result<String, String> {
    env::var("ENVIRONMENT_ENDPOINT").or(Ok("http://localhost:3001".to_string()))
}

// Command to get the platform (e.g., "windows", "linux", "macos")
#[command]
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
#[command]
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
#[command]
fn get_arch() -> String {
    std::env::consts::ARCH.to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
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
