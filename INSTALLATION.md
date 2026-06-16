# Guide d'installation de LOGIMAK

## Configuration finale requise

### 1. Configuration des permissions Tauri

Ouvrez le fichier `src-tauri/capabilities/default.json` et ajoutez la permission du plugin store :

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

### 2. Lancement de l'application

Une fois la configuration des permissions effectuée, lancez l'application en mode développement :

```bash
npm run tauri dev
```

### 3. Build pour la production

Pour créer un exécutable de production :

```bash
npm run tauri build
```

L'exécutable sera généré dans le dossier `src-tauri/target/release/`.

## Fonctionnalités principales

### Configuration initiale
Au premier lancement, un assistant de configuration vous guidera à travers :
- Les informations générales de l'entreprise
- Les coordonnées de contact
- L'importation du logo
- La validation finale

### Les 5 vues principales

1. **Tableau de Bord**
   - Vue d'ensemble de l'activité
   - Chiffre d'affaires du jour et du mois
   - Nombre de ventes
   - Produits en stock
   - Alertes de stock faible

2. **Stock**
   - Ajout, modification et suppression de produits
   - Gestion des catégories
   - Suivi des quantités
   - Alertes de stock minimum

3. **Ventes**
   - Création de ventes avec panier
   - Sélection des produits
   - Calcul automatique des montants
   - Génération et impression de factures A4
   - Historique des ventes

4. **Rapports**
   - Rapport des ventes
   - Rapport du stock
   - Rapport du chiffre d'affaires
   - Filtres par période (jour, mois, année, personnalisée)
   - Impression des rapports

5. **Paramètres**
   - Modification des informations de l'entreprise
   - Gestion du logo
   - Informations complémentaires
   - À propos de LOGIMAK

## Caractéristiques techniques

- **Framework**: Tauri + React + TypeScript
- **Stockage**: Local avec Tauri Store (aucune connexion Internet requise)
- **Impression**: HTML natif (format A4)
- **Design**: Interface moderne et professionnelle
- **Compatibilité**: Windows, macOS, Linux

## Support

Pour toute assistance :
- **Site web**: www.makkadev.com
- **Email**: info@makkadev.com
- **Téléphone**: +235 66 64 76 40

---

**LOGIMAK v1.0.0** - Propulsé par MakkaDev
N'Djamena, Tchad
