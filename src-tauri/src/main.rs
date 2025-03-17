// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
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

fn main() {
    techiegenie_app_lib::run()
}
