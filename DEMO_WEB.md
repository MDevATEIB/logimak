# LOGIMAK - Démonstration Web

## 🌐 Vue d'ensemble

LOGIMAK propose une **version de démonstration en ligne** qui permet de tester toutes les fonctionnalités sans installation. Cette version web fonctionne directement dans le navigateur et utilise localStorage pour stocker les données.

---

## ✨ Fonctionnalités de la démo

### Identique à la version desktop
- ✅ Toutes les fonctionnalités sont disponibles
- ✅ Interface identique à l'application
- ✅ Gestion complète du stock
- ✅ Système de ventes et facturation
- ✅ Génération de rapports
- ✅ Paramètres de l'entreprise
- ✅ Impression de factures et rapports

### Spécificités de la version web
- 🔄 **Sauvegarde automatique** dans le navigateur (localStorage)
- 📦 **Données de démonstration** préchargées en un clic
- 🔄 **Réinitialisation rapide** pour recommencer
- 💾 **Export/Import JSON** pour sauvegarder vos tests
- 🎯 **Bannière de démonstration** toujours visible

---

## 🚀 Déploiement de la démo

### Option 1 : GitHub Pages (Gratuit)

#### Étape 1 : Build de la version web
```bash
# Ajouter les scripts dans package.json
npm run build:web
```

#### Étape 2 : Créer le dépôt GitHub
```bash
git init
git add .
git commit -m "Initial commit - LOGIMAK Demo"
git branch -M main
git remote add origin https://github.com/votre-compte/logimak-demo.git
git push -u origin main
```

#### Étape 3 : Déployer sur GitHub Pages
```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Déployer
npm run deploy:web
```

#### Étape 4 : Activer GitHub Pages
1. Allez sur votre dépôt GitHub
2. Settings → Pages
3. Source : gh-pages branch
4. Save

**URL de la démo :** `https://votre-compte.github.io/logimak-demo/`

---

### Option 2 : Netlify (Gratuit)

#### Via l'interface web (le plus simple)

1. **Build de la version web**
   ```bash
   npm run build:web
   ```

2. **Déployer sur Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Drag & drop le dossier `dist-web/`
   - C'est tout !

**URL générée :** `https://random-name.netlify.app`

#### Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build
npm run build:web

# Déployer
netlify deploy --dir=dist-web --prod
```

---

### Option 3 : Vercel (Gratuit)

```bash
# Installer Vercel CLI
npm install -g vercel

# Build
npm run build:web

# Déployer
cd dist-web
vercel --prod
```

**URL générée :** `https://logimak-demo.vercel.app`

---

### Option 4 : Google Drive (Partage de fichiers)

⚠️ **Limitation :** Google Drive ne peut pas héberger d'applications web interactives avec JavaScript. Cette option n'est pas recommandée pour la démo web.

**Alternative recommandée :** Utilisez GitHub Pages, Netlify ou Vercel à la place.

---

## 📦 Scripts NPM à ajouter

Ajoutez ces scripts dans votre `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "dev:web": "vite --config vite.config.web.ts",
    "build": "tsc && vite build",
    "build:web": "tsc && vite build --config vite.config.web.ts",
    "preview:web": "vite preview --config vite.config.web.ts --outDir dist-web",
    "deploy:web": "npm run build:web && gh-pages -d dist-web"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1"
  }
}
```

---

## 🎨 Personnalisation de la bannière

La bannière de démonstration est personnalisable dans `index.web.html` :

```html
<div class="demo-banner">
  <div class="demo-banner-content">
    <span class="demo-icon">🎯</span>
    <div class="demo-text">
      <strong>MODE DÉMONSTRATION</strong> - Personnalisez ce message
    </div>
  </div>
  <div class="demo-buttons">
    <!-- Vos boutons personnalisés -->
  </div>
</div>
```

---

## 🔧 Configuration avancée

### Ajouter Google Analytics

Dans `index.web.html`, avant la fermeture du `</head>` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Ajouter un domaine personnalisé

#### Sur Netlify :
1. Domain settings → Add custom domain
2. Suivez les instructions DNS

#### Sur Vercel :
1. Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS

**Exemple :** `demo.logimak.com`

---

## 📊 Données de démonstration

### Chargement automatique

La démo inclut des données exemple qui peuvent être chargées en un clic :

```typescript
// Dans database.web.ts
async loadDemoData() {
  const demoData = {
    companyInfo: { /* ... */ },
    products: [ /* ... */ ],
    sales: [ /* ... */ ],
    // ...
  };
  this.saveData(demoData);
}
```

### Personnaliser les données de démo

Modifiez la méthode `loadDemoData()` dans `src/services/database.web.ts` pour adapter :
- Le nom de l'entreprise
- Les produits exemple
- Les ventes exemple
- Les catégories

---

## 🔐 Limitations et sécurité

### Limitations de localStorage

- **Capacité** : ~5-10 MB selon le navigateur
- **Persistance** : Les données sont effacées si l'utilisateur vide le cache
- **Partage** : Impossible de partager les données entre appareils

### Recommandations

1. **Mode démo uniquement** : Ne pas utiliser pour de vraies données commerciales
2. **Message d'avertissement** : Toujours afficher que c'est une démo
3. **Lien de téléchargement** : Proposer l'application complète
4. **Instructions claires** : Expliquer que les données sont locales

---

## 📱 Responsive Design

La démo est entièrement responsive et fonctionne sur :
- 💻 Desktop (1920x1080 et plus)
- 💻 Laptop (1366x768)
- 📱 Tablette (768x1024)
- 📱 Mobile (375x667 et plus)

---

## 🎯 Cas d'usage

### Pour les clients potentiels
- Tester avant d'acheter
- Comprendre les fonctionnalités
- Évaluer l'interface utilisateur
- Simuler leur utilisation

### Pour la présentation commerciale
- Démonstration en direct
- Formation des équipes
- Salons et événements
- Webinaires et tutoriels

### Pour le marketing
- Landing page interactive
- Campagnes publicitaires
- Réseaux sociaux
- Email marketing

---

## 📈 Tracking et Analytics

### Événements à tracker

```javascript
// Exemples d'événements Google Analytics
gtag('event', 'demo_started', {
  'event_category': 'engagement',
  'event_label': 'Demo Started'
});

gtag('event', 'feature_used', {
  'event_category': 'engagement',
  'event_label': 'Stock Management'
});

gtag('event', 'demo_data_loaded', {
  'event_category': 'engagement',
  'event_label': 'Demo Data Loaded'
});
```

---

## 🚀 Performance

### Optimisations

1. **Lazy loading** des composants
2. **Code splitting** automatique par Vite
3. **Compression gzip** sur les serveurs
4. **Cache des assets** statiques
5. **Minification** JavaScript et CSS

### Résultats attendus

- ⚡ **Temps de chargement** : < 3 secondes
- 📦 **Taille du bundle** : ~300 KB (gzippé)
- 🎯 **Score Lighthouse** : > 90/100

---

## 📋 Checklist de déploiement

- [ ] Build de la version web sans erreurs
- [ ] Test sur différents navigateurs (Chrome, Firefox, Safari)
- [ ] Test sur mobile et tablette
- [ ] Vérification des données de démonstration
- [ ] Bannière de démo visible et fonctionnelle
- [ ] Boutons de réinitialisation et chargement fonctionnels
- [ ] Lien de téléchargement actif
- [ ] Google Analytics configuré (optionnel)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] SSL/HTTPS activé
- [ ] Métadonnées SEO configurées
- [ ] Favicon et icônes présents

---

## 🌐 URLs de démo recommandées

### Structure d'URL professionnelle

- **Principal** : `https://demo.logimak.com`
- **Alternatif** : `https://app.logimak.com/demo`
- **GitHub Pages** : `https://makkadev.github.io/logimak-demo`

### Sous-domaines par région

- `https://demo-td.logimak.com` (Tchad)
- `https://demo-cm.logimak.com` (Cameroun)
- `https://demo-fr.logimak.com` (France)

---

## 💡 Conseils pour maximiser l'engagement

### 1. Onboarding interactif

Ajoutez un tutoriel guidé au premier lancement :
```javascript
// Tour guidé avec intro.js ou shepherd.js
const tour = new Shepherd.Tour({
  useModalOverlay: true
});

tour.addStep({
  id: 'welcome',
  text: 'Bienvenue dans la démo de LOGIMAK !',
  // ...
});
```

### 2. Call-to-action visibles

- Bouton "Télécharger l'application" toujours visible
- Popup après 5 minutes d'utilisation
- Formulaire de contact intégré

### 3. Vidéo de démonstration

Intégrez une vidéo YouTube dans la page :
```html
<div class="demo-video">
  <iframe 
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Démo LOGIMAK"
  ></iframe>
</div>
```

---

## 📞 Support et assistance

Pour toute question sur le déploiement de la démo :

**MakkaDev**
- Email : info@makkadev.com
- Téléphone : +235 66 64 76 40
- Site : www.makkadev.com

---

## 🔄 Mises à jour

### Processus de mise à jour

1. **Modifier le code source**
2. **Tester localement** : `npm run dev:web`
3. **Build** : `npm run build:web`
4. **Déployer** : `npm run deploy:web`

### Fréquence recommandée

- **Corrections de bugs** : Immédiatement
- **Nouvelles fonctionnalités** : Mensuellement
- **Données de démo** : Trimestriellement

---

## 📊 Exemples de landing page

### Structure HTML de base

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <title>LOGIMAK - Essayez la démo gratuite</title>
</head>
<body>
  <!-- Hero section -->
  <section class="hero">
    <h1>Testez LOGIMAK gratuitement</h1>
    <p>Découvrez toutes les fonctionnalités sans installation</p>
    <a href="/demo" class="btn-demo">Lancer la démo</a>
  </section>
  
  <!-- Features -->
  <section class="features">
    <!-- Fonctionnalités -->
  </section>
  
  <!-- Demo embed -->
  <section class="demo-embed">
    <iframe src="/demo" frameborder="0"></iframe>
  </section>
  
  <!-- CTA Download -->
  <section class="cta">
    <h2>Convaincu ? Téléchargez l'application</h2>
    <a href="/download" class="btn-download">Télécharger</a>
  </section>
</body>
</html>
```

---

*Document créé le 16 juin 2026 par l'équipe MakkaDev*
