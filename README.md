# LOGIMAK - Logiciel de Gestion Commerciale

![LOGIMAK](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Commercial-green)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

**LOGIMAK** est un logiciel de gestion commerciale moderne et professionnel, conçu pour les commerçants, boutiques et PME.

## 🎯 Objectif

Créer un logiciel de gestion commerciale local, moderne, élégant et performant, capable de répondre aux besoins réels des commerçants et PME africaines tout en offrant une expérience utilisateur de niveau professionnel.

## ✨ Fonctionnalités principales

### 📊 Tableau de Bord
- Vue d'ensemble de l'activité commerciale
- Chiffre d'affaires du jour et du mois
- Nombre de ventes et produits en stock
- Alertes de stock faible
- Graphiques et indicateurs clés

### 📦 Gestion du Stock
- Ajout, modification et suppression de produits
- Gestion des catégories
- Suivi des quantités en temps réel
- Alertes de stock minimum
- Historique des mouvements

### 🛒 Gestion des Ventes
- Création de ventes avec système de panier
- Sélection facile des produits
- Calcul automatique des montants
- Génération de factures professionnelles
- Impression au format A4
- Historique complet des transactions

### 📈 Rapports
- Rapport détaillé des ventes
- Rapport du stock et inventaire
- Rapport du chiffre d'affaires
- Filtres par période (jour, mois, année, personnalisée)
- Impression professionnelle des rapports

### ⚙️ Paramètres
- Configuration de l'entreprise
- Gestion du logo
- Coordonnées complètes
- Informations complémentaires
- Personnalisation des documents

## 🚀 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Rust (pour Tauri)

### Installation des dépendances

```bash
npm install
```

### Configuration

Consultez le fichier [INSTALLATION.md](./INSTALLATION.md) pour les instructions détaillées de configuration.

### Lancement en mode développement

```bash
npm run tauri dev
```

### Build pour la production

```bash
npm run tauri build
```

## 🏗️ Architecture technique

### Stack technologique
- **Frontend**: React 19 + TypeScript
- **Framework**: Tauri 2
- **Base de données**: Tauri Store (local)
- **Styling**: CSS personnalisé avec variables CSS
- **Icônes**: Lucide React
- **Graphiques**: Recharts
- **Dates**: date-fns

### Structure du projet

```
logimak/
├── src/
│   ├── components/        # Composants React
│   │   ├── Dashboard.tsx
│   │   ├── Stock.tsx
│   │   ├── Sales.tsx
│   │   ├── Reports.tsx
│   │   ├── Settings.tsx
│   │   ├── Layout.tsx
│   │   └── SetupWizard.tsx
│   ├── services/          # Services métier
│   │   └── database.ts
│   ├── types/             # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx            # Composant principal
│   ├── App.css            # Styles globaux
│   └── main.tsx           # Point d'entrée
├── src-tauri/             # Configuration Tauri
└── public/                # Ressources statiques
```

## 💡 Caractéristiques clés

✅ **100% Local** - Fonctionne entièrement hors ligne
✅ **Interface moderne** - Design professionnel et intuitif
✅ **Factures professionnelles** - Génération et impression A4
✅ **Données sécurisées** - Stockage local chiffré
✅ **Multi-plateforme** - Windows, macOS, Linux
✅ **Léger et rapide** - Performance optimisée
✅ **Sans abonnement** - Licence perpétuelle

## 📋 Configuration initiale

Au premier lancement, un assistant de configuration vous guide à travers :

1. **Étape 1** : Informations générales de l'entreprise
2. **Étape 2** : Coordonnées de contact
3. **Étape 3** : Importation du logo
4. **Étape 4** : Validation et finalisation

## 🖨️ Impression des documents

Les factures et rapports sont générés sous forme de pages HTML optimisées pour l'impression au format A4, compatibles avec tous les systèmes d'exploitation.

## 👥 Développé par MakkaDev

**MakkaDev** est une société de développement logiciel basée à N'Djamena, Tchad.

- **Siège** : N'Djamena, Tchad
- **Adresse** : Quartier Chagoua, derrière l'Ambassade des États-Unis
- **Site web** : [www.makkadev.com](https://www.makkadev.com)
- **Email** : info@makkadev.com
- **Téléphone** : +235 66 64 76 40

## 📄 Licence

Ce logiciel est un produit commercial développé par MakkaDev. Tous droits réservés.

## 🤝 Support

Pour toute assistance technique ou commerciale :
- Email : info@makkadev.com
- Téléphone : +235 66 64 76 40
- Site web : www.makkadev.com

---

**LOGIMAK v1.0.0** - © 2026 MakkaDev. Tous droits réservés.
