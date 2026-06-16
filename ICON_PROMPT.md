# Prompt de Génération d'Icône pour LOGIMAK

## Prompt pour Générateur d'Image IA (DALL-E, Midjourney, etc.)

```
Create a modern, professional application icon for "LOGIMAK", a commercial management software.

Design Requirements:
- Style: Modern, minimalist, professional
- Shape: Square with rounded corners (1024x1024px)
- Color Scheme: 
  - Primary: Deep blue (#2563eb) and purple (#764ba2)
  - Gradient: Use a smooth gradient from blue to purple
  - Accent: White or light elements for contrast

Icon Elements:
- Main symbol: A stylized letter "L" or "LM" monogram
- Secondary elements: Subtle geometric shapes suggesting:
  - Shopping cart (commerce)
  - Bar chart or graph (analytics)
  - Document or receipt (invoicing)
  
Design Style:
- Clean, geometric shapes
- Professional and trustworthy appearance
- Works well at small sizes (16x16px to 512x512px)
- No text (icon only, the "L" or "LM" should be abstract/stylized)
- Flat design with subtle depth/shadow
- High contrast for visibility

Technical Requirements:
- Resolution: 1024x1024 pixels
- Format: PNG with transparency
- Background: Transparent or solid gradient
- Safe area: Keep important elements within 80% of canvas

Mood: Professional, modern, reliable, efficient, commercial

Reference Style: Similar to Shopify, Square, or QuickBooks icons but unique and distinctive.

DO NOT INCLUDE:
- Actual text/letters (unless highly stylized as part of the logo)
- Complex illustrations
- Multiple colors beyond the blue-purple gradient palette
```

## Alternative Prompt Simplifié

```
Modern app icon for LOGIMAK business software. 
Minimalist geometric design. 
Blue to purple gradient (#2563eb to #764ba2). 
Stylized "L" monogram. 
1024x1024px PNG. 
Professional and clean. 
Transparent background.
```

## Instructions de Génération Manuelle

Si vous créez l'icône manuellement ou avec un designer :

### Concept 1 : Monogramme "L"
- Lettre "L" stylisée en forme géométrique
- Dégradé bleu-violet
- Ombres portées subtiles
- Bordure arrondie

### Concept 2 : Symbole Abstrait
- Forme géométrique représentant :
  - Un graphique en croissance (commerce)
  - Un document (facture)
  - Un panier (vente)
- Fusion harmonieuse des éléments
- Palette bleu-violet

### Concept 3 : Initiales "LM"
- Lettres "L" et "M" entrelacées
- Design moderne et épuré
- Gradient diagonal
- Contraste élevé

## Outils de Création Recommandés

### Générateurs IA
1. **DALL-E 3** (OpenAI) - Excellent pour les icônes modernes
2. **Midjourney** - Parfait pour le design professionnel
3. **Adobe Firefly** - Bon contrôle sur le style
4. **Stable Diffusion** - Open source et personnalisable

### Outils de Design
1. **Figma** - Gratuit, basé sur le web
2. **Adobe Illustrator** - Professionnel
3. **Inkscape** - Gratuit et open source
4. **Canva** - Simple et accessible

### Générateurs d'Icônes en Ligne
1. **IconKitchen** (https://icon.kitchen/)
2. **App Icon Generator** (https://appicon.co/)
3. **MakeAppIcon** (https://makeappicon.com/)

## Exemple de Code SVG (Base)

Si vous voulez créer l'icône en code SVG :

```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fond arrondi -->
  <rect width="1024" height="1024" rx="200" fill="url(#grad)"/>
  
  <!-- Lettre "L" stylisée (à personnaliser) -->
  <path d="M300,250 L450,250 L450,700 L700,700 L700,850 L300,850 Z" 
        fill="white" 
        opacity="0.95"/>
  
  <!-- Élément décoratif (graphique) -->
  <path d="M550,400 L650,300 L750,450 L850,350" 
        stroke="white" 
        stroke-width="40" 
        fill="none" 
        opacity="0.6"
        stroke-linecap="round"
        stroke-linejoin="round"/>
</svg>
```

## Checklist Finale

Avant de finaliser l'icône, vérifiez :

- [ ] Résolution 1024x1024px minimum
- [ ] Format PNG avec transparence
- [ ] Couleurs conformes à la charte (bleu-violet)
- [ ] Lisible à petite taille (16x16px)
- [ ] Pas de texte (sauf stylisé)
- [ ] Contraste suffisant
- [ ] Style professionnel et moderne
- [ ] Cohérent avec l'identité de LOGIMAK
- [ ] Fonctionne sur fond clair et foncé

## Nom du Fichier

Une fois généré, nommez le fichier :
- `app-icon.png` (1024x1024px)
- Placez-le dans le dossier `public/`

---

**Note** : L'icône doit refléter les valeurs de LOGIMAK :
- Professionnalisme
- Modernité
- Efficacité
- Fiabilité
- Simplicité d'utilisation
