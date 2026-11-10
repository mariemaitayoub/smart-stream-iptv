# 📚 Documentation — Concepts du Sprint II
 
Ce document regroupe l'ensemble des concepts vus en classe et dans le brief **Smart Stream**, avec des exemples tirés du projet.
 
## Sommaire
 
1. [Architecture modulaire (ES Modules)](#1-architecture-modulaire-es-modules)
2. [Fonctionnalités ES6+](#2-fonctionnalités-es6)
3. [Asynchronisme : Promises, async/await, try/catch](#3-asynchronisme)
4. [Fetch API](#4-fetch-api)
5. [Protocole HTTP et codes de statut](#5-protocole-http-et-codes-de-statut)
6. [MockAPI et format JSON](#6-mockapi-et-format-json)
7. [Manipulation du DOM et événements](#7-manipulation-du-dom-et-événements)
8. [Recherche, filtrage et regroupement](#8-recherche-filtrage-et-regroupement)
9. [LocalStorage](#9-localstorage)
10. [Gestion des états UI (loading / error / success)](#10-gestion-des-états-ui)
11. [Tailwind CSS](#11-tailwind-css)
12. [Lecteur vidéo HLS et EPG (bonus)](#12-lecteur-vidéo-hls-et-epg-bonus)
13. [Git, GitHub et Conventional Commits](#13-git-github-et-conventional-commits)
14. [Jira et méthodologie](#14-jira-et-méthodologie)
15. [Bonnes pratiques et glossaire](#15-bonnes-pratiques-et-glossaire)
---
 
## 1. Architecture modulaire (ES Modules)
 
### Principe
Un **module ES** est un fichier JavaScript qui possède sa propre portée et qui expose (`export`) ou consomme (`import`) des fonctionnalités. Cela évite les variables globales et facilite la maintenance.
 
### Export / Import
 
```js
// services/api.js
export const fetchChannels = async () => { /* ... */ };
export default { fetchChannels };
 
// main.js
import { fetchChannels } from "./services/api.js";
```
 
### Activation dans le HTML
 
```html
<script type="module" src="./src/main.js"></script>
```
 
### Points importants
- L'extension `.js` est **obligatoire** dans les chemins d'import côté navigateur.
- Les modules sont chargés en mode **strict** et de manière **différée** (`defer`).
- Un **serveur local** est nécessaire (CORS bloque `file://`).
- `export` nommé : plusieurs par fichier ; `export default` : un seul par fichier.
### Séparation des responsabilités (Separation of Concerns)
 
| Couche | Dossier | Responsabilité |
|---|---|---|
| Services | `services/api.js` | Appels réseau uniquement |
| UI | `ui/` | Rendu DOM uniquement |
| Événements | `events/` | Lien entre actions utilisateur, services et UI |
| Utilitaires | `utils/` | Fonctions pures réutilisables |
 
---
 
## 2. Fonctionnalités ES6+
 
### 2.1 `const` et `let`
- `const` : référence non réassignable (par défaut).
- `let` : variable réassignable, portée de bloc.
- Éviter `var` (portée de fonction, hoisting).
### 2.2 Fonctions fléchées (arrow functions)
 
```js
const getName = (channel) => channel.name;
const double = n => n * 2;               // un seul paramètre : parenthèses optionnelles
const log = () => console.log("ok");     // aucun paramètre
```
Particularité : elles ne possèdent pas leur propre `this`.
 
### 2.3 Template literals
 
```js
const label = `${channel.channelNumber} - ${channel.name}`;
```
 
### 2.4 Destructuring (déstructuration)
 
```js
// Objet
const { name, channelNumber, epg } = channel;
 
// Objet imbriqué
const { epg: { currentProgram, startTime, endTime } } = channel;
 
// Valeur par défaut et renommage
const { logo = "default.png", name: title } = channel;
 
// Tableau
const [first, second] = channels;
 
// Dans les paramètres d'une fonction
const renderItem = ({ name, logo, channelNumber }) => `...`;
```
 
### 2.5 Spread (`...`) — étaler
 
```js
const copy = [...channels];                          // copie de tableau
const updated = { ...channel, isLive: false };       // copie d'objet + modification
const merged = [...channelsA, ...channelsB];         // fusion
```
 
### 2.6 Rest (`...`) — regrouper
 
```js
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
const { id, ...otherProps } = channel;               // récupère le reste des propriétés
```
 > **Différence** : *spread* **étale** un élément itérable ; *rest* **regroupe** des éléments en un seul.

 ### 2.7 Méthodes de tableaux
 
| Méthode | Rôle | Retour | Exemple |
|---|---|---|---|
| `map` | Transforme chaque élément | Nouveau tableau | `channels.map(c => c.name)` |
| `filter` | Garde les éléments qui respectent une condition | Nouveau tableau | `channels.filter(c => c.isLive)` |
| `find` | Premier élément qui respecte la condition | Élément ou `undefined` | `channels.find(c => c.id === "2")` |
| `some` | Au moins un élément valide ? | `boolean` | `channels.some(c => c.isLive)` |
| `every` | Tous les éléments valides ? | `boolean` | `channels.every(c => c.logo)` |
| `reduce` | Accumule vers une valeur unique | Valeur | voir ci-dessous |
| `sort` | Trie (modifie le tableau d'origine) | Tableau | `[...channels].sort(...)` |
| `forEach` | Parcourt sans retour | `undefined` | — |
 
Regroupement par catégorie avec `reduce` :
 
```js
export const groupByCategory = (channels) =>
  channels.reduce((groups, channel) => {
    const { category } = channel;
    return { ...groups, [category]: [...(groups[category] ?? []), channel] };
  }, {});
```
 
### 2.8 Opérateurs modernes
- **Optional chaining** `?.` : `channel?.epg?.currentProgram`
- **Nullish coalescing** `??` : `value ?? "défaut"` (ne réagit qu'à `null`/`undefined`, contrairement à `||`)
- **Clés dynamiques** : `{ [category]: [] }`
- **Raccourci de propriété** : `{ name, id }` au lieu de `{ name: name, id: id }`
---
 
## 3. Asynchronisme
 
### 3.1 Pourquoi ?
JavaScript est **mono-thread**. Une opération longue (réseau) ne doit pas bloquer l'interface : elle est déléguée et son résultat est traité plus tard (**event loop**).
 
### 3.2 Évolution
 
| Approche | Inconvénient |
|---|---|
| Callbacks | « Callback hell », gestion d'erreurs difficile |
| Promises | Chaînage `.then()` / `.catch()` |
| `async/await` | Syntaxe synchrone, lisible |
 
### 3.3 Promise
 
Trois états : **pending** (en attente), **fulfilled** (résolue), **rejected** (rejetée).
 
```js
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log("terminé"));
```
 
Méthodes statiques utiles : `Promise.all`, `Promise.allSettled`, `Promise.race`.
 
### 3.4 `async` / `await`
- `async` devant une fonction : elle retourne **toujours une Promise**.
- `await` : met la fonction en pause jusqu'à la résolution de la Promise (uniquement dans une fonction `async` ou au niveau supérieur d'un module).
```js
const loadChannels = async () => {
  try {
    showLoader();
    const channels = await fetchChannels();
    renderSidebar(channels);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoader();
  }
};
```
 
### 3.5 `try / catch / finally`
- `try` : code susceptible d'échouer.
- `catch` : traitement de l'erreur.
- `finally` : toujours exécuté (idéal pour masquer le spinner).
- `throw new Error("...")` : déclenche manuellement une erreur.
---
 
## 4. Fetch API
 
### 4.1 Syntaxe de base
 
```js
const response = await fetch(url, options);
```
 
`fetch` retourne une Promise qui se résout en objet **`Response`**.
 
### 4.2 Propriétés de `Response`
 
| Propriété / méthode | Description |
|---|---|
| `response.ok` | `true` si le statut est entre 200 et 299 |
| `response.status` | Code HTTP (200, 404, 500…) |
| `response.statusText` | Texte associé au code |
| `response.json()` | Lit le corps et le parse en JSON (Promise) |
| `response.text()` | Lit le corps en texte |
 
### 4.3 ⚠️ Point crucial
**`fetch` ne rejette PAS la Promise sur une erreur HTTP (404, 500).** Elle ne rejette que sur une **erreur réseau** (pas de connexion, DNS, CORS). Il faut donc toujours vérifier `response.ok`.
 
### 4.4 Service complet (`services/api.js`)
 
```js
const BASE_URL = "https://<id>.mockapi.io/api/v1";
 
const ERROR_MESSAGES = {
  404: "Ressource introuvable. Vérifiez l'URL de l'API.",
  500: "Le serveur rencontre un problème. Réessayez plus tard.",
};
 
const request = async (endpoint, options = {}) => {
  let response;
 
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error("Impossible de joindre le serveur. Vérifiez votre connexion.");
  }
 
  if (!response.ok) {
    const { status } = response;
    throw new Error(ERROR_MESSAGES[status] ?? `Erreur HTTP ${status}`);
  }
 
  return response.json();
};
 
export const fetchChannels = () => request("/channels");
export const fetchChannelById = (id) => request(`/channels/${id}`);
```
 
### 4.5 Options de `fetch` (autres méthodes HTTP)
 
```js
await fetch(url, {
  method: "POST",                                   // GET par défaut
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```
 
---
 
## 5. Protocole HTTP et codes de statut
 
### 5.1 Modèle client / serveur
Le client envoie une **requête** ; le serveur renvoie une **réponse**. HTTP est un protocole **sans état** (stateless).
 
### 5.2 Structure d'une requête
- **Ligne de requête** : méthode + URL + version
- **En-têtes (headers)** : `Content-Type`, `Accept`, `Authorization`…
- **Corps (body)** : optionnel (POST, PUT, PATCH)
### 5.3 Méthodes HTTP (CRUD)
 
| Méthode | Action | CRUD |
|---|---|---|
| `GET` | Lire | Read |
| `POST` | Créer | Create |
| `PUT` | Remplacer entièrement | Update |
| `PATCH` | Modifier partiellement | Update |
| `DELETE` | Supprimer | Delete |
 
### 5.4 Familles de codes de statut
 
| Plage | Famille |
|---|---|
| `1xx` | Information |
| `2xx` | Succès |
| `3xx` | Redirection |
| `4xx` | Erreur côté **client** |
| `5xx` | Erreur côté **serveur** |
 
### 5.5 Codes à maîtriser
 
| Code | Nom | Signification | Gestion dans le projet |
|---|---|---|---|
| `200` | OK | Requête réussie | Afficher les chaînes |
| `201` | Created | Ressource créée | — |
| `204` | No Content | Succès sans corps | — |
| `400` | Bad Request | Requête invalide | Message générique |
| `401` / `403` | Unauthorized / Forbidden | Non authentifié / interdit | — |
| `404` | Not Found | Ressource introuvable | « Ressource introuvable » |
| `429` | Too Many Requests | Limite de requêtes atteinte | Réessayer plus tard |
| `500` | Internal Server Error | Erreur serveur | « Problème serveur » |
| `503` | Service Unavailable | Service indisponible | Réessayer plus tard |
 
### 5.6 CORS (Cross-Origin Resource Sharing)
Mécanisme de sécurité du navigateur qui contrôle les requêtes entre origines différentes (domaine, port ou protocole). MockAPI autorise les requêtes cross-origin, d'où le bon fonctionnement depuis `localhost`.
 
---
 
## 6. MockAPI et format JSON
 
### 6.1 MockAPI
Service en ligne qui permet de créer une **API REST factice** : on définit des ressources (ex. `channels`) et on obtient automatiquement des endpoints.
 
| Endpoint | Méthode | Action |
|---|---|---|
| `/channels` | GET | Liste des chaînes |
| `/channels/:id` | GET | Une chaîne |
| `/channels` | POST | Créer une chaîne |
| `/channels/:id` | PUT | Modifier une chaîne |
| `/channels/:id` | DELETE | Supprimer une chaîne |
 
### 6.2 JSON (JavaScript Object Notation)
Format texte d'échange de données.
 
Règles : clés entre **guillemets doubles**, pas de virgule finale, pas de commentaires, types : `string`, `number`, `boolean`, `null`, `array`, `object`.
 
```js
JSON.parse('{"a":1}');         // texte → objet
JSON.stringify({ a: 1 });      // objet → texte
```
 
### 6.3 Modèle de données `channel`
 
| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique (généré par MockAPI) |
| `channelNumber` | string | Numéro de la chaîne |
| `name` | string | Nom de la chaîne |
| `category` | string | Catégorie (DOCUMENTAIRE, SPORT…) |
| `logo` | string (URL) | Logo (60×60) |
| `previewImage` | string (URL) | Image de couverture (800×450) |
| `streamUrl` | string (URL) | Flux vidéo `.m3u8` |
| `isLive` | boolean | Chaîne en direct |
| `epg` | object | `currentProgram`, `startTime`, `endTime`, `progressPercentage` |
 
---
 
## 7. Manipulation du DOM et événements
 
### 7.1 Sélection
 
```js
document.querySelector("#sidebar");
document.querySelectorAll(".channel-item");
document.getElementById("search-input");
```
 
### 7.2 Modification
 
```js
element.textContent = "Texte";          // sûr
element.innerHTML = "<b>HTML</b>";      // ⚠️ risque XSS avec des données non maîtrisées
element.classList.add("bg-blue-600");
element.classList.remove("bg-blue-600");
element.classList.toggle("hidden");
element.setAttribute("src", url);
element.dataset.id = "3";               // attribut data-id
```
 
### 7.3 Création d'éléments
 
```js
const li = document.createElement("li");
li.textContent = name;
list.append(li);
```
 
### 7.4 Événements
 
```js
button.addEventListener("click", (event) => { /* ... */ });
input.addEventListener("input", (event) => { /* ... */ });
```
 
| Événement | Usage |
|---|---|
| `click` | Sélection d'une chaîne |
| `input` | Recherche instantanée à chaque frappe |
| `DOMContentLoaded` | Démarrage de l'application |
| `error` | Image/vidéo en échec |
 
### 7.5 Délégation d'événements
Un seul écouteur sur le parent plutôt qu'un par élément : plus performant, fonctionne avec les éléments ajoutés dynamiquement.
 
```js
sidebar.addEventListener("click", (event) => {
  const item = event.target.closest("[data-id]");
  if (!item) return;
  selectChannel(item.dataset.id);
});
```
 
### 7.6 Debounce
Retarde l'exécution d'une fonction tant que l'utilisateur continue de saisir, afin de limiter les traitements.
 
```js
export const debounce = (fn, delay = 250) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
```
 
---
 
## 8. Recherche, filtrage et regroupement
 
### 8.1 Normalisation du texte
Rendre la recherche insensible à la casse et aux accents :
 
```js
export const normalize = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
```
 
### 8.2 Filtrage par nom ou numéro
 
```js
export const searchChannels = (channels, query) => {
  const q = normalize(query.trim());
  if (!q) return channels;
 
  return channels.filter(({ name, channelNumber }) =>
    normalize(name).includes(q) || channelNumber.includes(q)
  );
};
```
 
### 8.3 Flux de données (Single Source of Truth)
 
```
API → state.channels  (jamais modifié)
          │
          ├── recherche → filteredChannels → groupByCategory → rendu sidebar
          └── clic      → find(id) → state.activeChannel → rendu preview + EPG
```
 
On conserve la liste complète intacte et on **dérive** la liste affichée à chaque recherche.
 
---
 
## 9. LocalStorage
 
### 9.1 Principe
Stockage **clé/valeur** dans le navigateur, **persistant** (survit à la fermeture), ~5 Mo, limité à l'origine (domaine). Ne stocke que des **chaînes de caractères**.
 
### 9.2 API
 
```js
localStorage.setItem("key", "value");
localStorage.getItem("key");        // null si absent
localStorage.removeItem("key");
localStorage.clear();
```
 
### 9.3 Objets : sérialisation
 
```js
localStorage.setItem("lastChannel", JSON.stringify({ id: "2" }));
const data = JSON.parse(localStorage.getItem("lastChannel"));
```
 
### 9.4 Wrapper sécurisé (`utils/storage.js`)
 
```js
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Écriture LocalStorage impossible :", error);
  }
};
 
export const loadFromStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
```
 
### 9.5 Restauration au démarrage
 
```js
const lastId = loadFromStorage("smartstream:lastChannelId");
const channel = channels.find(({ id }) => id === lastId) ?? channels[0];
```
 
### 9.6 Comparatif
 
| | LocalStorage | SessionStorage | Cookies |
|---|---|---|---|
| Durée | Illimitée | Onglet | Configurable |
| Capacité | ~5 Mo | ~5 Mo | ~4 Ko |
| Envoyé au serveur | Non | Non | Oui |
 
---
 
## 10. Gestion des états UI
 
Une requête asynchrone traverse trois états que l'interface doit refléter.
 
| État | Déclencheur | Affichage |
|---|---|---|
| **Loading** | Début de la requête | Spinner |
| **Success** | Réponse `ok` | Liste des chaînes |
| **Error** | Erreur réseau ou HTTP | Message explicite + bouton « Réessayer » |
 
### Spinner Tailwind
 
```html
<div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div>
```
 
### Module `ui/feedback.js`
 
```js
export const showLoader = (container) => {
  container.innerHTML = `
    <div class="flex h-full items-center justify-center">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div>
    </div>`;
};
 
export const showError = (container, message, onRetry) => {
  container.innerHTML = `
    <div class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-red-400">
      <p>⚠️ ${message}</p>
      <button id="retry-btn" class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500">Réessayer</button>
    </div>`;
  container.querySelector("#retry-btn").addEventListener("click", onRetry);
};
```
 
### Accessibilité
Ajouter `role="status"` / `aria-live="polite"` sur le loader et `role="alert"` sur les erreurs.
 
---
 
## 11. Tailwind CSS
 
### 11.1 Principe « utility-first »
Au lieu d'écrire du CSS personnalisé, on compose le style à l'aide de **classes utilitaires** directement dans le HTML. Le brief impose l'usage **exclusif** de ces classes.
 
### 11.2 Mise en place rapide (CDN)
 
```html
<script src="https://cdn.tailwindcss.com"></script>
```
 
### 11.3 Classes essentielles
 
| Catégorie | Exemples |
|---|---|
| Layout | `flex`, `grid`, `hidden`, `relative`, `absolute`, `h-screen`, `w-full` |
| Flexbox | `flex-col`, `items-center`, `justify-between`, `gap-4` |
| Espacement | `p-4`, `px-3`, `my-2`, `space-y-2` |
| Couleurs | `bg-slate-900`, `text-white`, `border-slate-700` |
| Typographie | `text-sm`, `font-bold`, `uppercase`, `truncate` |
| Bordures | `rounded-lg`, `border`, `ring-2` |
| Effets | `shadow-lg`, `opacity-50`, `transition`, `animate-spin` |
| Interaction | `hover:bg-slate-700`, `focus:ring-2`, `cursor-pointer` |
| Responsive | `md:flex`, `lg:w-80`, `sm:hidden` |
 
### 11.4 Responsive (mobile-first)
 
| Préfixe | Largeur minimale |
|---|---|
| *(aucun)* | 0 px (mobile) |
| `sm:` | 640 px |
| `md:` | 768 px |
| `lg:` | 1024 px |
| `xl:` | 1280 px |
 
### 11.5 Mise en page Smart TV
 
```html
<body class="flex h-screen bg-slate-950 text-white">
  <aside class="flex w-full flex-col border-r border-slate-800 md:w-80">
    <input type="search" placeholder="Recherche TV en direct"
           class="m-3 rounded-lg bg-slate-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
    <div id="channel-list" class="flex-1 overflow-y-auto"></div>
  </aside>
 
  <main id="preview" class="hidden flex-1 flex-col md:flex"></main>
</body>
```
 
### 11.6 Élément actif (surbrillance)
 
```js
const ACTIVE = ["bg-blue-600", "text-white"];
const IDLE = ["hover:bg-slate-800"];
item.classList.add(...(isActive ? ACTIVE : IDLE));
```
 
> Avec le CDN, les classes ajoutées dynamiquement fonctionnent car Tailwind observe le DOM.
 
---
 
## 12. Lecteur vidéo HLS et EPG (bonus)
 
### 12.1 HLS (HTTP Live Streaming)
Protocole de streaming qui découpe la vidéo en petits segments décrits par une playlist **`.m3u8`**. Safari le lit nativement ; les autres navigateurs nécessitent **hls.js**.
 
### 12.2 Intégration
 
```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.17"></script>
```
 
```js
let hls = null;
 
export const playStream = (video, url) => {
  hls?.destroy();                                   // libère l'ancien flux
 
  if (window.Hls?.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;                                // Safari
  } else {
    throw new Error("Lecture HLS non supportée par ce navigateur.");
  }
};
```
 
### 12.3 Balise `<video>`
 
```html
<video id="player" class="aspect-video w-full rounded-lg bg-black" controls autoplay muted playsinline></video>
```
 
> `muted` est requis pour que l'autoplay soit autorisé par la plupart des navigateurs.
 
### 12.4 EPG (Electronic Program Guide)
 
```js
export const renderEpg = ({ epg: { currentProgram, startTime, endTime, progressPercentage } }) => `
  <div class="space-y-2 p-4">
    <p class="text-xs uppercase tracking-wide text-blue-400">À l'antenne</p>
    <h3 class="text-lg font-semibold">${currentProgram}</h3>
    <div class="flex items-center justify-between text-sm text-slate-400">
      <span>${startTime}</span><span>${endTime}</span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-slate-700">
      <div class="h-full rounded-full bg-blue-500" style="width: ${progressPercentage}%"></div>
    </div>
  </div>`;
```
 
---
 
## 13. Git, GitHub et Conventional Commits
 
### 13.1 Concepts
 
| Terme | Définition |
|---|---|
| Repository | Dépôt contenant le code et son historique |
| Commit | Instantané des modifications |
| Branch | Ligne de développement parallèle |
| Merge | Fusion de deux branches |
| Pull Request (PR) | Demande de fusion, avec relecture |
| Remote / origin | Dépôt distant (GitHub) |
| Conflict | Modifications incompatibles à résoudre manuellement |
 
### 13.2 Commandes essentielles
 
```bash
git init
git clone <url>
git status
git add .
git commit -m "feat: message"
git push origin <branche>
git pull origin <branche>
git checkout -b feature/search       # créer + basculer (ou : git switch -c)
git branch -a
git merge develop
git log --oneline --graph
```
 
### 13.3 Stratégie de branches
 
```
main     ●────────────────────────●  (versions stables)
          \                      /
develop    ●──●──────●──────●───●    (intégration)
            \  \    /      /
             \  ●──●      /           feature/preview-ui
              ●──●────────            feature/mockapi-service
```
 
Règles du brief :
1. `main` = version stable.
2. `develop` = intégration.
3. Une branche par fonctionnalité.
4. Pull Request vers `develop`, avec vérification du code.
5. Fusion `develop` → `main` après validation finale.
### 13.4 Workflow type
 
```bash
git checkout develop
git pull origin develop
git checkout -b feature/mockapi-service
# ... développement ...
git add .
git commit -m "feat: add fetchChannels service with HTTP status handling"
git push -u origin feature/mockapi-service
# → ouvrir une Pull Request vers develop sur GitHub
```
 
### 13.5 Conventional Commits
 
Format : `type(portée optionnelle): description`
 
| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Mise en forme (sans impact logique) |
| `refactor` | Restructuration sans changement de comportement |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, configuration |
 
Exemples :
 
```
feat(api): add fetchChannels with response.ok check
feat(ui): render sidebar grouped by category
feat(search): filter channels by name or number
fix(search): handle accents and case in query
style(sidebar): highlight active channel with Tailwind
docs: add README and Sprint II documentation
```
 
### 13.6 Modèle de Pull Request
 
```markdown
## Description
Ce que fait cette PR.
 
## Changements
- ...
 
## Comment tester
1. ...
 
## Checklist
- [ ] Le code fonctionne en local
- [ ] Aucune erreur dans la console
- [ ] Commits au format Conventional Commits
```
 
### 13.7 `.gitignore` conseillé
 
```
node_modules/
.DS_Store
.env
.vscode/
```
 
---
 
## 14. Jira et méthodologie
 
### 14.1 Vocabulaire Agile / Scrum
 
| Terme | Définition |
|---|---|
| Sprint | Période de travail à durée fixe (ici 5 jours) |
| Backlog | Liste priorisée des tâches |
| User Story | Besoin formulé : « En tant que… je veux… afin de… » |
| Epic | Grand ensemble regroupant plusieurs User Stories |
| Definition of Done | Critères qui valident une tâche comme terminée |
 
### 14.2 Tableau Jira
 
Colonnes : **À faire → En cours → En revue → Terminé**
 
Tâches suggérées (à lier aux branches Git) :
 
| Clé | Tâche | Branche |
|---|---|---|
| SS-1 | Créer `data.json` et la ressource MockAPI | — |
| SS-2 | Service `fetchChannels` + gestion HTTP | `feature/mockapi-service` |
| SS-3 | États loading / error | `feature/mockapi-service` |
| SS-4 | Sidebar groupée par catégorie | `feature/sidebar` |
| SS-5 | Zone de prévisualisation | `feature/preview-ui` |
| SS-6 | Recherche instantanée | `feature/search` |
| SS-7 | LocalStorage | `feature/storage` |
| SS-8 | Lecteur HLS (bonus) | `feature/video-player` |
| SS-9 | EPG (bonus) | `feature/epg` |
| SS-10 | README + documentation | `docs/readme` |
| SS-11 | Déploiement | — |
 
### 14.3 User Stories du brief (rappel)
 
| # | Thème | Résumé |
|---|---|---|
| 1 | Architecture | Modules séparés, async/await, try/catch, `map/filter/find` |
| 2 | Données & HTTP | `data.json`, MockAPI, Fetch, `response.ok`, loading, error |
| 3 | Catalogue | Sidebar groupée, activation d'une chaîne, recherche |
| 4 | Workflow | Branches, Conventional Commits, Pull Requests |
| 5 | Tailwind | Classes utilitaires exclusivement |
| Bonus 1 | Lecteur | Lecture du `streamUrl` |
| Bonus 2 | EPG | Programme en cours + barre de progression |
 
---
 
## 15. Bonnes pratiques et glossaire
 
### 15.1 Bonnes pratiques
- Une fonction = une responsabilité.
- Nommer clairement variables et fonctions (`fetchChannels`, `renderSidebar`).
- Ne jamais manipuler le DOM dans la couche services.
- Toujours vérifier `response.ok`.
- Toujours utiliser `try/catch` autour de `await`.
- Ne pas muter l'état d'origine : privilégier `filter`, `map`, spread.
- Échapper ou éviter `innerHTML` avec des données non fiables (risque XSS).
- Fournir un texte `alt` aux images et gérer l'événement `error` des images.
- Commits petits, fréquents et explicites.
### 15.2 Questions probables à l'oral
 
| Question | Réponse courte |
|---|---|
| Pourquoi `fetch` ne lève-t-il pas d'erreur sur un 404 ? | Il ne rejette que sur erreur réseau ; il faut tester `response.ok`. |
| Différence `map` / `forEach` ? | `map` retourne un nouveau tableau, `forEach` non. |
| Différence `find` / `filter` ? | `find` retourne le premier élément, `filter` un tableau. |
| Que fait `await` ? | Suspend la fonction `async` jusqu'à la résolution de la Promise. |
| Spread vs rest ? | Spread étale, rest regroupe. |
| Pourquoi un serveur local pour les modules ? | CORS bloque les imports depuis `file://`. |
| Pourquoi `finally` ? | Exécuté dans tous les cas, utile pour cacher le spinner. |
| Pourquoi la délégation d'événements ? | Un seul écouteur, compatible avec les éléments dynamiques. |
| Pourquoi `JSON.stringify` pour LocalStorage ? | Il ne stocke que des chaînes. |
| Rôle d'une Pull Request ? | Relire et valider avant intégration dans `develop`. |
 
### 15.3 Glossaire
 
| Terme | Définition |
|---|---|
| API | Interface permettant à deux programmes de communiquer |
| REST | Style d'architecture d'API basé sur HTTP et des ressources |
| Endpoint | URL d'accès à une ressource d'API |
| JSON | Format texte d'échange de données |
| Promise | Objet représentant une valeur disponible plus tard |
| Event loop | Mécanisme qui orchestre les tâches asynchrones |
| DOM | Représentation objet de la page HTML |
| IPTV | Télévision diffusée via Internet |
| EPG | Guide électronique des programmes |
| HLS | Protocole de streaming par segments (`.m3u8`) |
| Debounce | Technique de limitation de fréquence d'exécution |
| Mock | Simulation d'un service réel pour les tests |
| Utility-first | Approche CSS basée sur de petites classes réutilisables |
 
---
 
##  Ressources
 
- [MDN — Fetch API](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)
- [MDN — async/await](https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Async_JS)
- [MDN — Modules JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules)
- [MDN — Codes de statut HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/fr/)
- [hls.js](https://github.com/video-dev/hls.js/)
- [MockAPI](https://mockapi.io)
 