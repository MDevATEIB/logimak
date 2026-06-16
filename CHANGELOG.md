# Changelog - LOGIMAK

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.2] - 2026-06-16

### ✨ Nouvelles fonctionnalités

#### Gestion complète de la base de données
- **Sauvegarde automatique quotidienne** : Une copie de la base de données est créée automatiquement chaque jour au démarrage dans le dossier `db_logimak`
- **Format des sauvegardes** : Fichiers nommés `db_YYYY-MM-DD.json` (ex: `db_2026-06-16.json`)
- **Trois boutons de gestion** dans Paramètres :
  - **Exporter** : Créer une sauvegarde manuelle au format JSON
  - **Importer** : Restaurer les données depuis un fichier de sauvegarde
  - **Réinitialiser** : Effacer toutes les données commerciales (conserve les infos entreprise)
- **Interface utilisateur intuitive** avec icônes et descriptions claires
- **Modal de confirmation** pour la réinitialisation avec avertissements de sécurité
- **Messages informatifs** sur chaque opération

#### Sécurité et prévention des pertes
- **Avertissements clairs** avant les opérations destructives
- **Recommandations de sauvegarde** affichées dans l'interface
- **Rechargement automatique** après import/réinitialisation
- **Conservation des informations entreprise** lors de la réinitialisation

### 🔧 Technique
- Ajout de **tauri-plugin-fs** pour l'accès au système de fichiers
- Ajout de **tauri-plugin-dialog** pour les dialogues natifs
- Nouvelles méthodes dans le service `database.ts` :
  - `getBackupDir()` : Gestion du dossier de sauvegarde
  - `createAutoBackup()` : Sauvegarde automatique quotidienne
  - `exportData()` : Export manuel ou automatique
  - `importData()` : Import avec dialogue de sélection
  - `resetDatabase()` : Réinitialisation sécurisée
- Permissions étendues dans `capabilities/default.json`
- Nouvelles variables CSS : `--success-light`, `--danger-light`, `--warning-light`, `--info-light`

### 📄 Documentation
- Nouveau fichier **GESTION_BASE_DONNEES.md** avec :
  - Guide complet de la gestion des sauvegardes
  - Bonnes pratiques
  - Résolution de problèmes
  - Questions fréquentes
  - Calendrier de sauvegarde recommandé

### 📦 Dépendances
- `@tauri-apps/plugin-fs` : ^2
- `@tauri-apps/plugin-dialog` : ^2

## [1.0.1] - 2026-06-16

### 🔧 Améliorations et corrections

#### ✨ Documents imprimables simplifiés
- **Design simplifié et professionnel** : Refonte complète des factures et rapports
  - Suppression des sections avec couleurs vives qui prenaient trop d'espace
  - Design minimaliste avec tons de gris (#222, #333, #666, #888, #999)
  - Suppression des dégradés colorés et des arrière-plans complexes
  - Mise en page épurée et élégante
  - Meilleure lisibilité pour l'impression papier
  - Espacement optimisé pour maximiser le contenu utile

#### 🔧 Corrections techniques
- **Système d'impression amélioré** : Utilisation d'iframe au lieu de `window.open()` pour une meilleure compatibilité avec Tauri
- **Correction des erreurs TypeScript** : Suppression du code HTML dupliqué dans `Sales.tsx`
- **Correction de la fonction formatCurrency** : Définition locale de la fonction dans les templates HTML pour éviter les erreurs de référence
- **Code plus maintenable** : Nettoyage et optimisation des templates HTML

#### 📄 Fichiers modifiés
- `src/components/Sales.tsx` : Simplification du template de facture
- `src/components/Reports.tsx` : Simplification des templates de rapports
- `CHANGELOG.md` : Documentation des changements

## [1.0.0] - 2026-06-16

### 🎉 Version Initiale

#### ✨ Fonctionnalités principales

**Interface Utilisateur**
- Interface moderne et professionnelle avec design haut de gamme
- Thème clair optimisé pour une utilisation professionnelle
- Navigation intuitive avec sidebar et topbar
- Design responsive et adaptatif
- Animations fluides et transitions soignées

**Assistant de Configuration**
- Configuration guidée en 4 étapes au premier lancement
- Collecte des informations de l'entreprise
- Import du logo avec prévisualisation
- Validation et confirmation des données
- Possibilité de modification ultérieure

**Tableau de Bord**
- Vue d'ensemble de l'activité commerciale
- Statistiques en temps réel :
  - Chiffre d'affaires du jour
  - Chiffre d'affaires du mois
  - Nombre de ventes
  - Produits en stock
  - Alertes de stock faible
- Cartes statistiques avec icônes colorées
- Actions rapides pour accès direct aux fonctionnalités
- Section informative sur les fonctionnalités

**Gestion du Stock**
- Création et gestion de catégories
- Ajout de produits avec informations détaillées :
  - Nom et description
  - Catégorie
  - Prix unitaire
  - Quantité en stock
  - Stock minimum (alertes automatiques)
  - Code-barres (optionnel)
- Modification et suppression de produits
- Recherche rapide par nom ou description
- Filtrage par catégorie
- Vue tableau avec toutes les informations
- Calcul automatique de la valeur totale du stock
- Alertes visuelles pour stock faible

**Gestion des Ventes**
- Création de ventes avec système de panier
- Sélection facile des produits disponibles
- Ajout multiple de produits au panier
- Modification des quantités
- Suppression d'articles du panier
- Informations client (nom, téléphone) optionnelles
- Calcul automatique du total
- Génération automatique de numéro de facture unique
- Impression de factures professionnelles au format A4
- Historique complet des ventes avec :
  - Numéro de facture
  - Date et heure
  - Client
  - Montant
  - Réimpression possible

**Système de Facturation**
- Génération automatique de factures professionnelles
- Format A4 optimisé pour l'impression
- En-tête avec logo et informations de l'entreprise
- Détail des articles vendus
- Calcul des totaux
- Design professionnel et épuré
- Compatible avec tous les navigateurs
- Impression directe depuis l'application

**Rapports et Statistiques**
- Trois types de rapports :
  - Rapport des ventes
  - Rapport du stock
  - Rapport du chiffre d'affaires
- Filtres temporels :
  - Aujourd'hui
  - Ce mois
  - Cette année
  - Période personnalisée
- Statistiques détaillées :
  - Chiffre d'affaires total
  - Nombre de transactions
  - Panier moyen
  - Valeur du stock
  - Produits en alerte
- Tableaux détaillés avec toutes les données
- Impression des rapports au format A4
- Visualisation claire et professionnelle

**Paramètres**
- Gestion complète des informations de l'entreprise :
  - Nom
  - Numéro fiscal
  - Téléphone
  - Email
  - Adresse complète
  - Site web
  - Logo
  - Informations complémentaires
- Validation des champs obligatoires
- Prévisualisation du logo
- Sauvegarde avec confirmation
- Section "À propos" avec informations sur MakkaDev

#### 🔧 Technique

**Architecture**
- Tauri 2.0 pour le backend natif
- React 19 avec TypeScript pour le frontend
- Vite pour le build rapide
- Tauri Store pour le stockage local des données

**Base de données**
- Stockage local avec Tauri Store
- Aucune dépendance à Internet
- Données chiffrées et sécurisées
- Sauvegarde automatique

**Performance**
- Compilation optimisée
- Bundle JavaScript minifié (86 KB gzippé)
- Chargement rapide
- Interface fluide et réactive

**Sécurité**
- Données stockées localement
- Aucune transmission vers des serveurs externes
- Validation des entrées utilisateur
- Protection contre les injections

**Compatibilité**
- Windows (7, 8, 10, 11)
- macOS (10.15+)
- Linux (distributions principales)

#### 📦 Dépendances

**Frontend**
- react@19.1.0
- react-dom@19.1.0
- lucide-react@1.18.0 (icônes)
- recharts@3.8.1 (graphiques)
- date-fns@4.4.0 (gestion des dates)
- @tauri-apps/api@2
- @tauri-apps/plugin-store@2

**Backend**
- tauri@2
- tauri-plugin-store@2
- tauri-plugin-opener@2

#### 📝 Documentation

- README.md complet avec présentation du projet
- INSTALLATION.md avec instructions détaillées
- DEMARRAGE_RAPIDE.md pour bien démarrer
- CONFIGURATION_TAURI.md pour la configuration avancée
- CHANGELOG.md pour suivre les versions

#### 🎨 Design

- Palette de couleurs professionnelle
- Variables CSS personnalisables
- Typographie soignée (Segoe UI)
- Icônes cohérentes (Lucide React)
- Ombres et effets subtils
- Animations fluides
- Scrollbar personnalisée
- Design print-friendly pour les impressions

#### 🌍 Localisation

- Interface en français
- Format de devise : FCFA (Franc CFA)
- Format de date : français (jour/mois/année)
- Fuseau horaire local

#### 👥 Crédits

**Développé par MakkaDev**
- Société : MakkaDev
- Lieu : N'Djamena, Tchad
- Contact : info@makkadev.com
- Téléphone : +235 66 64 76 40
- Site : www.makkadev.com

---

## Format du Changelog

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

### Types de changements

- `Ajouté` pour les nouvelles fonctionnalités
- `Modifié` pour les changements dans les fonctionnalités existantes
- `Déprécié` pour les fonctionnalités bientôt supprimées
- `Supprimé` pour les fonctionnalités supprimées
- `Corrigé` pour les corrections de bugs
- `Sécurité` pour les vulnérabilités corrigées
