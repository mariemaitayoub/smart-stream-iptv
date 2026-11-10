# Smart Stream — Plateforme IPTV & TV en direct
 
Application web dynamique, modulaire et 100 % côté client qui permet de parcourir un catalogue de chaînes TV, de les rechercher instantanément, de les prévisualiser et (bonus) de les lire en direct avec un guide des programmes (EPG).
 
> Projet Sprint II — Brief **Smart Stream** (Nexora's) · Travail individuel · Lancement : 09/11/2026 · Rendu : 13/11/2026 avant 23h59
 
---
 
##  Liens
 
| Élément | Lien |
|---|---|
| Application déployée | `https://<votre-pseudo>.github.io/smart-stream/` *(à compléter)* |
| Dépôt GitHub | `https://github.com/<votre-pseudo>/smart-stream` *(à compléter)* |
| API MockAPI (endpoint `channels`) | `https://<id>.mockapi.io/api/v1/channels` *(à compléter)* |
| Tableau Jira | `https://<votre-espace>.atlassian.net/...` *(à compléter)* |
 
---
 
##  Objectifs du projet
 
- Structurer le code en **modules ES** (services / UI / événements).
- Consommer une API REST avec **Fetch API**, **Promises** et **async/await**.
- Gérer proprement les **états HTTP** (200, 404, 500) ainsi que les états **loading** et **error**.
- Traiter les données avec les méthodes **ES6+** (`map`, `filter`, `find`, destructuring, spread/rest, fonctions fléchées).
- Reproduire une interface **Smart TV** avec **Tailwind CSS** uniquement (classes utilitaires).
- Travailler avec un workflow **Git/GitHub** professionnel (branches, Conventional Commits, Pull Requests).
---
 
##  Fonctionnalités
 
### Fonctionnalités principales
-  **Chargement des chaînes** depuis MockAPI via `fetch` (vérification de `response.ok` et du code HTTP).
-  **Spinner de chargement** pendant la récupération des données.
-  **Message d'erreur explicite** (réseau, 404, 500) avec bouton « Réessayer ».
-  **Panneau latéral** listant les chaînes (numéro, logo, titre) **groupées par catégorie**.
-  **Sélection d'une chaîne** : mise en surbrillance dans la liste + affichage de `previewImage`, du numéro et du nom dans la zone principale.
-  **Recherche « TV en direct »** : filtrage instantané par nom ou par numéro.
-  **LocalStorage** : la dernière chaîne sélectionnée et la dernière recherche sont restaurées après actualisation.
-  **Responsive** : panneau latéral rétractable sur mobile.
### Bonus
-  **Lecteur vidéo interactif** : lecture du flux HLS (`streamUrl`) avec [hls.js](https://github.com/video-dev/hls.js/).
-  **EPG (Now Playing)** : programme en cours, heure de début/fin et barre de progression (`progressPercentage`).
---

## Technologies
 
| Technologie | Usage |
|---|---|
| HTML5 | Structure sémantique |
| JavaScript (ES2015+) | Logique applicative, modules ES |
| Tailwind CSS | Mise en forme (classes utilitaires uniquement) |
| Fetch API | Requêtes HTTP vers MockAPI |
| MockAPI | API REST de test (ressource `channels`) |
| hls.js *(bonus)* | Lecture des flux `.m3u8` |
| LocalStorage | Persistance côté client |
| Git / GitHub | Versionnage et Pull Requests |
| Jira | Suivi des tâches |
 
---
 
##  Structure du projet
 
```
smart-stream/
├── index.html              # Page principale (point d'entrée)
├── data.json               # Données initiales importées dans MockAPI
├── README.md
├── documentation.md        # Concepts du Sprint II
└── src/
    ├── main.js             # Point d'entrée JS : initialisation de l'app
    ├── state.js            # État partagé (chaînes, chaîne active, recherche)
    ├── services/
    │   └── api.js          # Couche services : appels Fetch vers MockAPI
    ├── ui/
    │   ├── sidebar.js      # Rendu de la liste groupée par catégorie
    │   ├── preview.js      # Zone d'affichage principale (image / lecteur)
    │   ├── epg.js          # Rendu EPG et barre de progression (bonus)
    │   └── feedback.js     # Spinner (loading) et message d'erreur (error)
    ├── events/
    │   └── handlers.js     # Gestion des événements (clic, recherche)
    └── utils/
        ├── storage.js      # Wrapper LocalStorage (get / set avec try/catch)
        └── helpers.js      # Fonctions utilitaires (debounce, groupBy, normalize)
```
 
### Responsabilités des couches
 
| Couche | Rôle |
|---|---|
| `services/` | Communication avec l'API. Ne touche jamais au DOM. |
| `ui/` | Construction et mise à jour du DOM. Ne fait aucun appel réseau. |
| `events/` | Relie les actions utilisateur aux services et à l'UI. |
| `utils/` | Fonctions pures réutilisables. |
 
---
 
##  Installation et lancement
 
### 1. Cloner le dépôt
 
```bash
git clone https://github.com/<votre-pseudo>/smart-stream.git
cd smart-stream
```
 
### 2. Préparer MockAPI
 
1. Créer un compte sur [mockapi.io](https://mockapi.io) et un nouveau projet.
2. Ajouter une ressource nommée **`channels`**.
3. Définir les champs : `channelNumber`, `name`, `category`, `logo`, `previewImage`, `streamUrl`, `isLive`, `epg` (objet).
4. Importer le contenu de `data.json` (ou saisir les données manuellement).
5. Copier l'URL de base de l'endpoint, par exemple :
   `https://<id>.mockapi.io/api/v1/channels`
### 3. Configurer l'URL de l'API
 
Dans `src/services/api.js` :
 
```js
const BASE_URL = "https://<id>.mockapi.io/api/v1";
```
 
### 4. Lancer avec un serveur local
 
>  Les modules ES (`type="module"`) ne fonctionnent pas en ouvrant `index.html` directement (`file://`). Un serveur local est obligatoire.
 
Au choix :
 
```bash
# Option 1 : VS Code → extension « Live Server » → clic droit sur index.html → Open with Live Server
 
# Option 2 : Python
python -m http.server 5500
 
# Option 3 : Node.js
npx serve .
```
 
Puis ouvrir `http://localhost:5500`.
 
---
 
##  Déploiement
 
Le projet étant 100 % statique, il peut être déployé gratuitement sur :
 
- **GitHub Pages** : *Settings → Pages → Source : branche `main`, dossier `/ (root)`*
- **Netlify** ou **Vercel** : import du dépôt GitHub, aucun build nécessaire.
---
 
##  API — Codes HTTP gérés
 
| Code | Signification | Comportement dans l'application |
|---|---|---|
| `200` | OK | Affichage du catalogue |
| `404` | Ressource introuvable | Message : « Ressource introuvable. Vérifiez l'URL de l'API. » |
| `500` | Erreur serveur | Message : « Le serveur rencontre un problème. Réessayez plus tard. » |
| Réseau | Pas de connexion / `TypeError` | Message : « Impossible de joindre le serveur. Vérifiez votre connexion. » |
 
### Exemple de ressource `channel`
 
```json
{
  "id": "1",
  "channelNumber": "1057",
  "name": "FR - DISCOVERY ID FHD",
  "category": "DOCUMENTAIRE",
  "logo": "https://via.placeholder.com/60x60?text=Discovery",
  "previewImage": "https://via.placeholder.com/800x450?text=Discovery+Show",
  "streamUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "isLive": true,
  "epg": {
    "currentProgram": "Habitations en péril",
    "startTime": "20:50",
    "endTime": "21:45",
    "progressPercentage": 65
  }
}
```
 
---
 
##  Workflow Git
 
### Stratégie de branches
 
```
main        ← version stable (production)
 └── develop        ← branche d'intégration
      ├── feature/mockapi-service
      ├── feature/preview-ui
      ├── feature/search
      ├── feature/video-player      (bonus)
      └── feature/epg               (bonus)
```
 
### Règles
 
1. Une branche par fonctionnalité, créée depuis `develop`.
2. Une Pull Request vers `develop` pour chaque fonctionnalité.
3. Relecture/vérification du code avant chaque fusion.
4. Fusion de `develop` dans `main` après validation finale.
### Conventional Commits
 
```
feat: ajouter le service fetchChannels avec gestion des codes HTTP
fix: corriger le filtre de recherche par numéro de chaîne
style: ajuster l'espacement du panneau latéral avec Tailwind
refactor: extraire le rendu de la sidebar dans ui/sidebar.js
docs: mettre à jour le README
```
 
---
 
##  Critères de performance couverts
 
- [x] Données (dernière chaîne, recherche) sauvegardées dans **LocalStorage** et restaurées
- [x] Recherche / filtrage cohérents (nom + numéro)
- [x] Code organisé en **modules ES** avec imports/exports
- [x] **Destructuring, spread/rest, arrow functions** utilisés de façon pertinente
- [x] Interface **responsive** avec états de chargement et d'erreur visibles
- [x] Dépôt Git avec branches, commits explicites et Pull Requests
- [x] **Fetch API, Promises, async/await**
- [x] Gestion des codes **HTTP 200, 404, 500**
---
 
