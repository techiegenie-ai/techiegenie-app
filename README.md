# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Release Process
```sh
git tag -a v0.1.0 -m "Release v1.0.0"
git push origin v1.1.0
```

### Delete a tag
```sh
git tag -d v0.1.0
git push origin --delete v0.1.0
```

### Mac replacing an app signature
```sh
xattr -rc /Applications/TechieGenie.app && codesign --force --deep --sign - /Applications/TechieGenie.app
```
