# 🚀 Guide de Démarrage Rapide - LOGIMAK

## Installation et Configuration

### 1. ✅ Vérification de l'installation

Les dépendances ont déjà été installées. Le projet est prêt à être utilisé !

### 2. ⚙️ Configuration automatique

La configuration des permissions a déjà été effectuée avec succès. ✅

Si vous devez reconfigurer, exécutez :
```bash
npm run setup
```

### 3. 🏃 Lancer l'application en mode développement

Pour démarrer LOGIMAK en mode développement :

```bash
npm run tauri dev
```

**Note** : Le premier lancement peut prendre quelques minutes car Rust doit compiler les dépendances Tauri.

### 4. 🎯 Première utilisation

Au premier lancement :
1. **Assistant de configuration** s'affichera automatiquement
2. Suivez les 4 étapes pour configurer votre entreprise :
   - Informations générales
   - Coordonnées de contact
   - Logo (optionnel)
   - Validation
3. Une fois configuré, vous accédez au tableau de bord

## Fonctionnalités disponibles

### 📊 Tableau de Bord
- Vue d'ensemble de l'activité
- Statistiques en temps réel
- Alertes de stock

### 📦 Gestion du Stock
- Créer des catégories
- Ajouter des produits
- Gérer les quantités
- Suivre les seuils minimums

### 🛒 Gestion des Ventes
1. Cliquer sur "Nouvelle vente"
2. Ajouter des produits au panier
3. Renseigner le client (optionnel)
4. Finaliser et imprimer la facture

### 📈 Rapports
- Filtrer par période
- Choisir le type de rapport
- Imprimer les résultats

### ⚙️ Paramètres
- Modifier les informations de l'entreprise
- Changer le logo
- Ajouter des informations complémentaires

## 🏗️ Build pour Production

Pour créer un exécutable de production :

```bash
npm run tauri build
```

L'exécutable sera disponible dans :
- Windows : `src-tauri/target/release/logimak.exe`
- macOS : `src-tauri/target/release/bundle/macos/`
- Linux : `src-tauri/target/release/bundle/appimage/`

## 📝 Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run setup` | Configure les permissions automatiquement |
| `npm run tauri dev` | Lance l'app en mode développement |
| `npm run build` | Compile le frontend uniquement |
| `npm run tauri build` | Compile l'application complète |
| `npm run preview` | Prévisualise le build frontend |

## ⚠️ Résolution de problèmes

### L'application ne démarre pas
1. Vérifiez que Rust est installé : `rustc --version`
2. Vérifiez que Node.js est installé : `node --version`
3. Réinstallez les dépendances : `npm install`

### Erreur de permissions
Exécutez le script de configuration :
```bash
npm run setup
```

### Erreur de compilation Rust
Nettoyez et recompilez :
```bash
cd src-tauri
cargo clean
cd ..
npm run tauri dev
```

### Les données ne se sauvegardent pas
Vérifiez que le plugin store est bien configuré dans :
- `src-tauri/Cargo.toml` : dépendance `tauri-plugin-store`
- `src-tauri/src/lib.rs` : plugin initialisé
- `src-tauri/capabilities/default.json` : permission `store:default`

## 💡 Conseils d'utilisation

1. **Configurez d'abord votre entreprise** dans les paramètres
2. **Créez des catégories** avant d'ajouter des produits
3. **Définissez des stocks minimums** pour recevoir des alertes
4. **Utilisez la recherche** pour trouver rapidement des produits
5. **Imprimez les factures** directement depuis l'application

## 📞 Support

Besoin d'aide ?
- 📧 Email : info@makkadev.com
- 📱 Téléphone : +235 66 64 76 40
- 🌐 Site web : www.makkadev.com

---

**LOGIMAK v1.0.0** - Propulsé par MakkaDev 🇹🇩
