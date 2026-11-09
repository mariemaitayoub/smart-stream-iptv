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

 