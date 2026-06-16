# Déploiement de la démo LOGIMAK sur GitHub Pages

## 📋 Guide complet étape par étape

Ce guide vous accompagne pour déployer la version démo de LOGIMAK sur GitHub Pages **gratuitement**.

---

## 🎯 Résultat final

Une fois déployé, votre démo sera accessible à l'adresse :
```
https://votre-nom-utilisateur.github.io/logimak-demo/
```

**Exemple :** `https://makkadev.github.io/logimak-demo/`

---

## ⚙️ Prérequis

- [ ] Compte GitHub (gratuit)
- [ ] Git installé sur votre ordinateur
- [ ] Node.js et npm installés
- [ ] Le projet LOGIMAK sur votre machine

---

## 🚀 Étape 1 : Préparer le projet

### 1.1 Installer les dépendances

```bash
cd logimak
npm install
npm install --save-dev gh-pages
```

### 1.2 Vérifier la configuration

Assurez-vous que `package.json` contient ces scripts :

```json
{
  "scripts": {
    "dev:web": "vite --config vite.config.web.ts",
    "build:web": "tsc && vite build --config vite.config.web.ts",
    "preview:web": "vite preview --config vite.config.web.ts --outDir dist-web",
    "deploy:web": "npm run build:web && gh-pages -d dist-web"
  }
}
```

### 1.3 Tester localement

```bash
# Lancer la version web en local
npm run dev:web
```

Ouvrez http://localhost:5173 et testez que tout fonctionne.

---

## 📦 Étape 2 : Créer le dépôt GitHub

### 2.1 Créer le dépôt sur GitHub.com

1. Allez sur https://github.com
2. Cliquez sur le **+** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `logimak-demo`
   - **Description** : `Démonstration en ligne de LOGIMAK - Logiciel de gestion commerciale`
   - **Public** (obligatoire pour GitHub Pages gratuit)
   - ❌ Ne pas cocher "Initialize with README"
5. Cliquez sur **"Create repository"**

### 2.2 Lier le projet local au dépôt GitHub

```bash
# Initialiser git si ce n'est pas déjà fait
git init

# Créer un .gitignore si nécessaire
cat > .gitignore << EOL
node_modules/
dist/
dist-web/
.DS_Store
src-tauri/target/
EOL

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - LOGIMAK Demo Web"

# Renommer la branche en main
git branch -M main

# Ajouter le remote (remplacez par votre URL)
git remote add origin https://github.com/VOTRE-NOM/logimak-demo.git

# Pousser le code
git push -u origin main
```

---

## 🌐 Étape 3 : Déployer sur GitHub Pages

### 3.1 Build et déploiement automatique

```bash
# Cette commande va :
# 1. Compiler le projet en version web
# 2. Créer la branche gh-pages
# 3. Pousser le contenu sur GitHub
npm run deploy:web
```

**Attendez que le processus se termine** (environ 1-2 minutes).

### 3.2 Activer GitHub Pages

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** (en haut)
3. Dans le menu de gauche, cliquez sur **Pages**
4. Sous "Source", sélectionnez :
   - **Branch** : `gh-pages`
   - **Folder** : `/ (root)`
5. Cliquez sur **Save**

### 3.3 Attendre le déploiement

- GitHub va construire et déployer votre site (2-5 minutes)
- Une fois terminé, vous verrez un message vert :
  ```
  Your site is live at https://votre-nom.github.io/logimak-demo/
  ```

---

## ✅ Étape 4 : Vérification

### 4.1 Tester l'URL

Ouvrez votre navigateur et allez sur :
```
https://votre-nom-utilisateur.github.io/logimak-demo/
```

### 4.2 Checklist de vérification

- [ ] La bannière de démo est visible
- [ ] Le bouton "Charger données exemple" fonctionne
- [ ] Le bouton "Réinitialiser" fonctionne
- [ ] Vous pouvez créer un produit
- [ ] Vous pouvez créer une vente
- [ ] L'impression de facture fonctionne
- [ ] Les données persistent après rechargement
- [ ] L'application est responsive sur mobile

---

## 🔄 Étape 5 : Mises à jour futures

### Pour mettre à jour la démo après modifications :

```bash
# 1. Modifier le code
# 2. Commit les changements
git add .
git commit -m "Description de vos modifications"
git push

# 3. Redéployer
npm run deploy:web
```

**Délai de mise en ligne** : 2-5 minutes après le déploiement

---

## 🎨 Personnalisation

### Modifier le nom du dépôt

Si vous voulez changer l'URL, renommez le dépôt sur GitHub :
1. Settings → Repository name
2. Changez `logimak-demo` en un autre nom
3. L'URL deviendra : `https://votre-nom.github.io/nouveau-nom/`

### Ajouter un domaine personnalisé

#### Prérequis : Avoir un nom de domaine

1. **Sur GitHub Pages Settings** :
   - Ajoutez votre domaine : `demo.logimak.com`
   - Cochez "Enforce HTTPS"

2. **Chez votre registrar DNS** :
   - Ajoutez un enregistrement CNAME :
     ```
     demo.logimak.com → votre-nom.github.io
     ```

3. **Attendre la propagation DNS** (1-24h)

Votre démo sera accessible sur : `https://demo.logimak.com`

---

## 📊 Statistiques et analytics

### Ajouter Google Analytics

1. Créez un compte Google Analytics
2. Obtenez votre ID de suivi (ex: `G-XXXXXXXXXX`)
3. Modifiez `index.web.html` :

```html
<head>
  <!-- ... autres meta tags ... -->
  
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

4. Commit et redéployer :
```bash
git add index.web.html
git commit -m "Ajout Google Analytics"
git push
npm run deploy:web
```

### Suivre les événements

Dans votre code React, ajoutez des événements :

```typescript
// Quand un utilisateur charge les données de démo
(window as any).gtag?.('event', 'demo_data_loaded', {
  'event_category': 'engagement',
  'event_label': 'Demo Data'
});

// Quand un utilisateur crée une vente
(window as any).gtag?.('event', 'sale_created', {
  'event_category': 'feature_usage',
  'event_label': 'Sales'
});
```

---

## 🔧 Résolution de problèmes

### Erreur : "gh-pages not found"

```bash
npm install --save-dev gh-pages
```

### Erreur : "Permission denied"

```bash
# Vérifier vos identifiants Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Utiliser SSH au lieu de HTTPS
git remote set-url origin git@github.com:VOTRE-NOM/logimak-demo.git
```

### Erreur : "404 Page not found" après déploiement

1. Vérifiez que la branche `gh-pages` existe
2. Vérifiez les paramètres GitHub Pages
3. Attendez 5-10 minutes
4. Videz le cache du navigateur (Ctrl + Shift + R)

### La page est blanche

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs JavaScript
3. Assurez-vous que `base: './'` est dans `vite.config.web.ts`

### Les assets ne chargent pas

Dans `vite.config.web.ts`, vérifiez :
```typescript
export default defineConfig({
  base: './', // Important !
  // ...
});
```

---

## 📱 Partager votre démo

### Créer une page de destination

Créez un `README.md` attractif sur GitHub :

```markdown
# 🎯 LOGIMAK - Démonstration en ligne

[![Demo Live](https://img.shields.io/badge/Demo-Live-success)](https://votre-nom.github.io/logimak-demo/)

## 🌐 Essayer la démo

👉 **[Lancer la démo](https://votre-nom.github.io/logimak-demo/)**

## ✨ Fonctionnalités

- 📦 Gestion complète du stock
- 💰 Système de ventes et facturation
- 📊 Rapports détaillés
- 🖨️ Impression de factures professionnelles
- ⚙️ Configuration entreprise

## 📥 Télécharger l'application

[Télécharger LOGIMAK v1.0.2](https://github.com/makkadev/logimak/releases)

## 📞 Contact

- Site : www.makkadev.com
- Email : info@makkadev.com
- Tél : +235 66 64 76 40
```

### Créer un QR Code

1. Allez sur https://www.qr-code-generator.com/
2. Entrez votre URL : `https://votre-nom.github.io/logimak-demo/`
3. Téléchargez le QR Code
4. Utilisez-le sur :
   - Cartes de visite
   - Flyers
   - Présentations PowerPoint
   - Stand d'exposition

### Créer un lien court

1. Allez sur https://bit.ly ou https://tinyurl.com
2. Raccourcissez votre URL
3. Exemple : `https://bit.ly/logimak-demo`

---

## 🎁 Bonus : Badge de statut

Ajoutez un badge sur votre README principal :

```markdown
[![Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-blue)](https://votre-nom.github.io/logimak-demo/)
```

Résultat : ![Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-blue)

---

## 📊 Tableau de bord de déploiement

| Étape | Status | Commande |
|-------|--------|----------|
| Installation | ⏳ | `npm install` |
| Build local | ⏳ | `npm run build:web` |
| Test local | ⏳ | `npm run preview:web` |
| Créer dépôt | ⏳ | Via GitHub.com |
| Premier push | ⏳ | `git push -u origin main` |
| Déploiement | ⏳ | `npm run deploy:web` |
| Activer Pages | ⏳ | Via Settings GitHub |
| Vérification | ⏳ | Ouvrir l'URL |

---

## 📞 Support

Besoin d'aide pour le déploiement ?

**MakkaDev**
- Email : info@makkadev.com
- Téléphone : +235 66 64 76 40
- Site : www.makkadev.com

---

## ✅ Checklist finale

- [ ] Dépendances installées (`npm install`)
- [ ] Build web fonctionne (`npm run build:web`)
- [ ] Test local réussi (`npm run dev:web`)
- [ ] Dépôt GitHub créé
- [ ] Code poussé sur GitHub (`git push`)
- [ ] Déploiement effectué (`npm run deploy:web`)
- [ ] GitHub Pages activé (Settings → Pages)
- [ ] URL de démo accessible
- [ ] Données de démo se chargent
- [ ] Impression fonctionne
- [ ] Responsive testé (mobile/tablette)
- [ ] Google Analytics ajouté (optionnel)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] README.md créé avec lien démo
- [ ] QR Code généré (optionnel)

---

**🎉 Félicitations ! Votre démo LOGIMAK est maintenant en ligne !**

Partagez l'URL : `https://votre-nom.github.io/logimak-demo/`

---

*Guide créé le 16 juin 2026 par l'équipe MakkaDev*
