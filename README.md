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