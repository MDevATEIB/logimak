# Configuration Tauri pour LOGIMAK

## Fichiers à modifier manuellement

### 1. src-tauri/tauri.conf.json

Modifiez les valeurs suivantes :

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "LOGIMAK",
  "version": "1.0.0",
  "identifier": "com.makkadev.logimak",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "LOGIMAK - Gestion Commerciale",
        "width": 1400,
        "height": 900,
        "minWidth": 1200,
        "minHeight": 700,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### 2. src-tauri/capabilities/default.json

Ajoutez la permission store:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "store:default"
  ]
}
```

### 3. src-tauri/Cargo.toml

Modifiez le nom du package :

```toml
[package]
name = "logimak"
version = "1.0.0"
description = "LOGIMAK - Logiciel de gestion commerciale moderne"
authors = ["MakkaDev <info@makkadev.com>"]
edition = "2026"
```

## Script automatique

Vous pouvez utiliser le script de configuration automatique :

```bash
npm run setup
```

Ce script configurera automatiquement les permissions nécessaires.

## Vérification

Pour vérifier que tout fonctionne :

1. Lancez le projet en mode développement :
   ```bash
   npm run tauri dev
   ```

2. Vérifiez que :
   - L'application se lance sans erreur
   - Le titre de la fenêtre est "LOGIMAK - Gestion Commerciale"
   - L'assistant de configuration s'affiche au premier lancement
   - Les données sont sauvegardées correctement

## En cas d'erreur

Si vous rencontrez des erreurs liées au plugin store :
1. Vérifiez que la permission "store:default" est bien dans default.json
2. Assurez-vous que le plugin est bien importé dans lib.rs
3. Nettoyez et recompilez :
   ```bash
   cd src-tauri
   cargo clean
   cd ..
   npm run tauri dev
   ```
