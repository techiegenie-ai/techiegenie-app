# TechieGenie

## Introduction

TechieGenie is your personal computer assistant designed to simplify your computing experience. Whether you need to solve technical issues, perform tasks, or manage files, TechieGenie lets you do it all by simply asking in plain language—no technical expertise required.

### Key Features

- **Issue Resolution**: Quickly identify and fix common computer problems.
- **Task Automation**: Adjust settings, manage files, and more with simple commands.
- **File Conversion and Editing**: Convert and edit images, videos, PDFs, and other files without multiple tools.
- **Simple Interaction**: Communicate with your computer using everyday language.

TechieGenie saves you time and money by replacing the need for expensive software and ensures your privacy by keeping all actions local on your device.

## Getting Started

To begin using TechieGenie:

1. **Download the App**: You can download the latest version of TechieGenie directly from our [release page](/releases). Follow the installation instructions specific to your operating system (Windows, macOS, or Linux) below.

   - **For macOS Users**:  
     Please note that TechieGenie does not yet have an official signature, which macOS requires for seamless installation. Without a signature, macOS may flag the app as untrusted or prevent it from running. After installing the app, you’ll need to run the following commands in your terminal to allow it to work properly:
     ```sh
     xattr -rc /Applications/TechieGenie.app && codesign --force --deep --sign - /Applications/TechieGenie.app
     ```
     - **What these commands do**:
       - `xattr -rc /Applications/TechieGenie.app`: Removes extended attributes that macOS uses to mark the app as potentially unsafe (e.g., "downloaded from the internet"). This prevents the "unidentified developer" warning.
       - `codesign --force --deep --sign - /Applications/TechieGenie.app`: Applies an ad-hoc signature to the app, telling macOS that it’s safe to run. The `--force` flag overrides any existing signature, `--deep` ensures all components are signed, and `--sign -` uses a basic self-signature.
     - **Why this is needed**: Since TechieGenie lacks an official Apple developer signature, macOS’s security system (Gatekeeper) blocks it by default. These commands bypass that restriction.

   - **For Windows Users**:  
     Similarly, TechieGenie is currently unsigned, meaning Windows may display a security warning during installation due to its SmartScreen filter, which protects against unrecognized apps. To install it:
     - When the warning appears, click **"More info"**.
     - Then click **"Run anyway"** to proceed with the installation.
     - **Why this is needed**: Without a digital signature from a trusted certificate authority, Windows flags the app as potentially unsafe. Bypassing the warning allows you to trust and install TechieGenie manually.

2. **Sign In**: Launch the app and sign in or create an account to get started.
3. **Start Chatting**: Open the chat window and type your requests. For example:
   - "Show system status" to check your computer’s health.
   - "Convert all PNG files in Downloads to WebP" to handle file conversions.

TechieGenie will interpret your request and perform the actions directly on your computer.

## Features

### Issue Resolution

Say goodbye to computer frustrations. TechieGenie can troubleshoot and resolve common issues like slow performance, connectivity problems, or software glitches. Just describe what’s wrong, and it will either guide you through a fix or handle it for you.

### Task Automation

Simplify repetitive or complex tasks without technical know-how. Examples include:

- Adjusting system settings (e.g., brightness, volume).
- Organizing files and folders.
- Installing or updating software.
- Monitoring resources like disk space or memory usage.

Tell TechieGenie what you need, and it takes care of the rest.

### File Conversion and Editing

Manage your files effortlessly with built-in tools. TechieGenie supports:

- Converting image formats (e.g., PNG to WebP).
- Editing PDFs (e.g., merging, splitting).
- Compressing videos for smaller sizes.
- And more—all in one place.

No need for additional software; TechieGenie handles it all via the chat interface.

### Simple Interaction

Interact with your computer naturally. Forget complex commands or jargon—TechieGenie understands plain language. Try these examples:

- "How much space do my temporary files take up?"
- "I forgot my Wi-Fi password—can you help?"
- "Check my network status."

TechieGenie responds with answers or actions tailored to your request.

## Safety and Privacy

Your security and privacy are top priorities with TechieGenie.

### Safety Features

TechieGenie protects your system by classifying commands into risk levels:

- **Basic Actions**: Safe tasks like viewing files—run without approval.
- **Cautious Actions**: Moderate tasks (e.g., changing permissions)—may need your okay.
- **Critical Actions**: High-risk tasks (e.g., deleting system files)—always require approval.

Customize your safety settings to decide which actions need your review before execution.

### Privacy

All operations happen locally on your computer. Your files and data stay private, never uploaded to the cloud—unlike many online services. TechieGenie ensures your personal information remains secure.

## Support and Community

Need assistance? We’ve got you covered:

- **Documentation**: Explore our [user guide](#) for tips and tutorials.
- **Support**: Email us at support@techiegenie.co for help.
- **Community**: Join our forums to connect with other users, share ideas, and get advice.

## System Requirements

TechieGenie works on:

- **Operating Systems**: Windows, macOS, Linux.
- **Permissions**: Requires standard user permissions to perform tasks.
- **Internet**: Needed for initial sign-in and some features; core functions work offline.

