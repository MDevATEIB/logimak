#!/usr/bin/env node

/**
 * Script de configuration automatique des permissions Tauri
 * Pour LOGIMAK v1.0.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const capabilitiesPath = join(__dirname, 'src-tauri', 'capabilities', 'default.json');

const correctConfig = {
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "store:default"
  ]
};

try {
  // Lire le fichier actuel
  const currentConfig = JSON.parse(readFileSync(capabilitiesPath, 'utf8'));
  
  // Vérifier si store:default existe déjà
  if (currentConfig.permissions && currentConfig.permissions.includes('store:default')) {
    console.log('✅ Les permissions sont déjà configurées correctement !');
    process.exit(0);
  }
  
  // Ajouter la permission store:default
  if (!currentConfig.permissions.includes('store:default')) {
    currentConfig.permissions.push('store:default');
  }
  
  // Écrire la configuration mise à jour
  writeFileSync(capabilitiesPath, JSON.stringify(currentConfig, null, 2) + '\n', 'utf8');
  
  console.log('✅ Les permissions ont été configurées avec succès !');
  console.log('📦 Vous pouvez maintenant lancer l\'application avec : npm run tauri dev');
  
} catch (error) {
  console.error('❌ Erreur lors de la configuration :', error.message);
  console.log('\n📝 Veuillez configurer manuellement les permissions en ajoutant "store:default"');
  console.log('   dans le fichier src-tauri/capabilities/default.json');
  process.exit(1);
}
