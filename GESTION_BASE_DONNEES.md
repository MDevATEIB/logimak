# Gestion de la base de données - LOGIMAK

## Vue d'ensemble

LOGIMAK intègre un système complet de gestion de base de données qui permet de sauvegarder, restaurer et réinitialiser vos données commerciales en toute sécurité.

---

## 🔄 Sauvegarde automatique

### Fonctionnement

À chaque démarrage de l'application, LOGIMAK crée automatiquement une sauvegarde de votre base de données si aucune sauvegarde n'a été créée le jour même.

### Emplacement des sauvegardes

Les sauvegardes sont stockées dans le dossier **`LOGIMAK/db_logimak`** situé dans vos Documents :

- **Windows** : `C:\Users\<VotreNom>\Documents\LOGIMAK\db_logimak\`
- **macOS** : `~/Documents/LOGIMAK/db_logimak/`
- **Linux** : `~/Documents/LOGIMAK/db_logimak/`

Ce dossier est facilement accessible et vous pouvez y copier manuellement vos sauvegardes sur une clé USB ou un cloud.

### Format des fichiers

Les fichiers de sauvegarde sont nommés selon le format suivant :
```
db_YYYY-MM-DD.json
```

**Exemples :**
- `db_2026-06-16.json` - Sauvegarde du 16 juin 2026
- `db_2026-06-17.json` - Sauvegarde du 17 juin 2026
- `db_2026-12-31.json` - Sauvegarde du 31 décembre 2026

### Contenu des sauvegardes

Chaque fichier de sauvegarde contient :
- ✅ Informations de l'entreprise
- ✅ Tous les produits
- ✅ Toutes les catégories
- ✅ Toutes les ventes
- ✅ Tous les mouvements de stock
- ✅ État de configuration
- ✅ Date et heure de la sauvegarde

---

## 📊 Interface de gestion

L'interface de gestion de la base de données est accessible depuis **Paramètres > Gestion de la base de données**.

### Trois opérations disponibles

#### 1. 📥 Exporter

**Description :** Crée un fichier de sauvegarde manuel

**Utilisation :**
1. Cliquez sur le bouton **Exporter**
2. Choisissez l'emplacement et le nom du fichier
3. Le fichier JSON est créé avec toutes vos données

**Quand l'utiliser :**
- Avant une manipulation importante
- Pour créer une copie de sécurité externe
- Avant une mise à jour du logiciel
- Pour transférer les données vers un autre ordinateur

**Format du fichier :**
```json
{
  "isConfigured": true,
  "companyInfo": { ... },
  "products": [ ... ],
  "categories": [ ... ],
  "sales": [ ... ],
  "stockMovements": [ ... ],
  "exportDate": "2026-06-16T10:30:00.000Z"
}
```

---

#### 2. 📤 Importer

**Description :** Restaure les données depuis un fichier de sauvegarde

**Utilisation :**
1. Cliquez sur le bouton **Importer**
2. Sélectionnez le fichier de sauvegarde (.json)
3. Confirmez l'opération
4. L'application se recharge automatiquement

**⚠️ ATTENTION :**
- Cette opération **remplace** toutes les données actuelles
- Les données non sauvegardées seront **perdues**
- Il est recommandé d'exporter avant d'importer

**Quand l'utiliser :**
- Pour restaurer une sauvegarde après une erreur
- Pour récupérer des données perdues
- Pour transférer des données depuis un autre ordinateur
- Pour revenir à un état antérieur

---

#### 3. 🔄 Réinitialiser

**Description :** Efface toutes les données commerciales

**Utilisation :**
1. Cliquez sur le bouton **Réinitialiser**
2. Lisez attentivement l'avertissement
3. Confirmez l'opération
4. L'application se recharge automatiquement

**Ce qui est supprimé :**
- ❌ Tous les produits
- ❌ Toutes les catégories
- ❌ Toutes les ventes
- ❌ Tous les mouvements de stock

**Ce qui est conservé :**
- ✅ Informations de l'entreprise (nom, adresse, logo, etc.)
- ✅ État de configuration

**⚠️ ATTENTION :**
- Cette opération est **IRRÉVERSIBLE**
- **Exportez une sauvegarde avant** de réinitialiser
- Utilisez cette fonction uniquement si vous voulez repartir de zéro

**Quand l'utiliser :**
- Pour nettoyer des données de test
- Pour recommencer avec des données vierges
- Pour résoudre des problèmes de corruption de données

---

## 💡 Bonnes pratiques

### Sauvegardes régulières

1. **Automatique** : Laissez LOGIMAK créer les sauvegardes quotidiennes
2. **Manuel** : Exportez régulièrement sur un support externe (clé USB, cloud, etc.)
3. **Avant actions importantes** : Exportez avant :
   - Importation de données
   - Réinitialisation
   - Mise à jour du logiciel
   - Manipulation de grandes quantités de données

### Organisation des sauvegardes

```
📁 Mes Sauvegardes LOGIMAK/
├── 📁 Quotidiennes/
│   ├── db_2026_06_01.json
│   ├── db_2026_06_08.json
│   └── db_2026_06_15.json
├── 📁 Mensuelles/
│   ├── logimak_janvier_2026.json
│   ├── logimak_fevrier_2026.json
│   └── logimak_mars_2026.json
└── 📁 Critiques/
    ├── avant_import_fournisseur.json
    └── fin_inventaire_2026.json
```

### Calendrier de sauvegarde recommandé

| Fréquence | Type | Action |
|-----------|------|--------|
| **Quotidien** | Automatique | Aucune action requise |
| **Hebdomadaire** | Manuel | Exporter sur clé USB |
| **Mensuel** | Manuel | Exporter sur cloud (Google Drive, etc.) |
| **Avant action critique** | Manuel | Exporter avec nom descriptif |

---

## 🔒 Sécurité des données

### Chiffrement

Les données sont stockées localement dans le fichier `logimak.db` géré par Tauri Store. Les sauvegardes JSON sont en texte clair pour permettre la portabilité.

### Recommandations de sécurité

1. **Ne partagez pas** vos fichiers de sauvegarde publiquement
2. **Protégez** vos sauvegardes avec un mot de passe si elles contiennent des données sensibles
3. **Stockez** les sauvegardes dans un endroit sécurisé
4. **Chiffrez** les supports externes contenant des sauvegardes
5. **Testez** régulièrement la restauration de sauvegardes

---

## 🚨 Résolution de problèmes

### La sauvegarde automatique ne se crée pas

**Solutions :**
1. Vérifiez que le dossier `db_logimak` existe
2. Vérifiez les permissions d'écriture
3. Consultez les logs de l'application
4. Créez une sauvegarde manuelle via le bouton Exporter

### L'importation échoue

**Causes possibles :**
- Fichier JSON corrompu
- Format de fichier incorrect
- Permissions insuffisantes

**Solutions :**
1. Vérifiez que le fichier est un fichier JSON valide
2. Ouvrez le fichier dans un éditeur de texte pour vérifier sa structure
3. Essayez avec une autre sauvegarde
4. Contactez le support si le problème persiste

### Erreur après une réinitialisation

**Solutions :**
1. Redémarrez l'application
2. Vérifiez que les informations de l'entreprise sont toujours présentes
3. Si nécessaire, restaurez une sauvegarde via Importer

---

## 📋 Questions fréquentes

### Puis-je transférer mes données vers un autre ordinateur ?

**Oui !** Utilisez la fonction Exporter sur l'ordinateur source, puis Importer sur l'ordinateur destination.

### Les sauvegardes automatiques ralentissent-elles l'application ?

**Non.** La sauvegarde se fait au démarrage et ne prend que quelques millisecondes.

### Combien d'espace disque utilisent les sauvegardes ?

En moyenne, une sauvegarde occupe entre **10 KB et 500 KB** selon la quantité de données.

### Puis-je supprimer les anciennes sauvegardes automatiques ?

**Oui.** Vous pouvez manuellement supprimer les fichiers dans le dossier `db_logimak`. Gardez au moins les 7 derniers jours.

### Le format JSON est-il standard ?

**Oui.** Les fichiers sont en JSON standard et peuvent être lus par n'importe quel éditeur de texte ou outil JSON.

### Puis-je modifier manuellement un fichier de sauvegarde ?

**Techniquement oui**, mais ce n'est pas recommandé. Une erreur de syntaxe JSON rendra le fichier inutilisable.

---

## 📞 Support

En cas de problème avec la gestion de la base de données :

**MakkaDev**
- Email : info@makkadev.com
- Téléphone : +235 66 64 76 40
- Site : www.makkadev.com

---

## 🔄 Changelog

### Version 1.0.1
- ✨ Ajout de la sauvegarde automatique quotidienne
- ✨ Création du dossier `db_logimak` au démarrage
- ✨ Interface de gestion avec 3 boutons (Exporter, Importer, Réinitialiser)
- ✨ Nommage automatique des sauvegardes avec la date
- ✨ Modal de confirmation pour la réinitialisation
- ✨ Messages d'information et d'avertissement

---

*Document créé le 16 juin 2026 par l'équipe MakkaDev*
