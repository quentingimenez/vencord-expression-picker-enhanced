# Audit de qualité — Vencord Expression Picker Enhanced

Date : 2026-11-05

## Résumé

Le projet fonctionnait et sa suite de tests était verte, mais le cœur du
module (`src/picker-resize.js`, ~3 000 lignes) accumulait plusieurs
problèmes de maintenabilité : deux IIFE indépendantes, des helpers dupliqués,
des sélecteurs Discord éparpillés, deux boucles de polling, une localisation
incomplète du grip et plusieurs chemins d'erreur qui pouvaient laisser l'UI
dans un état bloqué.

L'audit a été suivi d'un refactor sans changement fonctionnel volontaire,
validé par les 104 tests existants puis par 8 tests ajoutés (112 au total).

## Constats et corrections

| Sévérité | Constat                                                                                                                          | Correction                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Élevée   | Deux IIFE séparées dupliquaient le garde de host, le drapeau d'installation et le hook de test.                                  | Une seule IIFE de bootstrap, un seul garde, un seul hook, un seul timer de maintenance.                                    |
| Élevée   | `setInterval(maintain, 250)` et `setInterval(tick, 300)` interrogeaient le DOM en parallèle.                                     | `maintain()` appelle désormais `initDrawer()` ; le timer de resize a été supprimé.                                         |
| Élevée   | `handleFiles()` pouvait laisser `busy = true` et le bouton désactivé si une exception inattendue survenait.                      | Bloc `try/finally` : l'état occupé est toujours réinitialisé.                                                              |
| Élevée   | `uploadManager.addFile()` pouvait jeter sans retour utilisateur.                                                                 | Try/catch avec message localisé `attachFailed`.                                                                            |
| Moyenne  | Les sélecteurs Discord (`backButton_fed6d3`, `result__2dc39`, etc.) étaient répétés dans une dizaine de fonctions.               | Objet `SELECTORS` centralisé et documenté.                                                                                 |
| Moyenne  | `getImportedNativeMatches()` était recalculé plusieurs fois par rendu et le regroupement par URL était dupliqué.                 | Index unique `buildImportFavoriteIndex()` (matches, par import, par chemin), réutilisé par le rendu et les boutons natifs. |
| Moyenne  | Les boutons d'action (`favorite`, `delete`, `back`, `clear`) réimplémentaient `role`, `tabindex`, `aria-label`, clic et clavier. | Helpers `createIconAction()` et `addActivationHandler()`.                                                                  |
| Moyenne  | Le libellé du grip était codé en français en dur.                                                                                | Clés `resizeHandle` et `resizeHandleLabel` ajoutées aux 14 langues, avec fallback anglais.                                 |
| Moyenne  | Le grip avait `role="button"` mais n'était ni focusable ni utilisable au clavier.                                                | `tabindex="0"`, flèches (Shift pour un pas plus grand), style `:focus-visible` et test dédié.                              |
| Moyenne  | `Intl.PluralRules` et la recherche de locale étaient recréés à chaque appel.                                                     | Cache des règles de pluriel et index des locales.                                                                          |
| Moyenne  | Les accès à `window.Vencord` et `findByProps` étaient répétés avec des try/catch ad hoc.                                         | Helpers `getVencord()`, `getWebpack()`, `getWebpackCommon()`, `findByProps()`.                                             |
| Moyenne  | Les transactions IndexedDB de lecture/écriture étaient dupliquées et `dbPromise` restait rejetée après une erreur.               | `requestAsPromise()`, `runWriteTransaction()`, réinitialisation de `dbPromise` sur échec.                                  |
| Faible   | Le statut d'import n'était pas annoncé aux lecteurs d'écran et la vue « Importés » n'avait pas de rôle.                          | `role="status"` + `aria-live="polite"` et `role="region"` + `aria-label`.                                                  |
| Faible   | Le canvas et l'encodage d'une frame étaient dupliqués entre image animée, image statique et vidéo.                               | Helpers `createCanvas()`, `captureFrame()`, `encodeSingleFrame()`.                                                         |
| Faible   | `seekVideo()` dupliquait le nettoyage timeout/listener sur chaque branche.                                                       | Fonction `settle()` unique avec nettoyage centralisé.                                                                      |
| Faible   | Le timer de révélation GIF n'était jamais annulé après un chargement réussi.                                                     | Timer stocké et annulé par `reveal()`.                                                                                     |
| Faible   | Le loader préload acceptait une hauteur initiale > 5000 px alors que le renderer la refusait.                                    | Bornes `__vcPickerMinHeight` / `__vcPickerMaxHeight` appliquées à la lecture et à l'écriture.                              |
| Faible   | `Copy-IfDifferent` ne comparait que les chemins, pas les contenus.                                                               | `Copy-FileIfChanged` compare les hash SHA-256.                                                                             |
| Faible   | Le watcher PowerShell ne vérifiait pas le code de sortie de l'installateur et pouvait mourir sur une erreur de surveillance.     | Vérification de `$LASTEXITCODE`, logs explicites et boucle protégée.                                                       |
| Faible   | `Installer.cs` appelait `WaitForExit()` deux fois et dupliquait le numéro de version.                                            | Appel unique documenté ; version dérivée de l'assembly.                                                                    |
| Faible   | Les délais (250, 3500, 10 000, etc.) étaient dispersés dans le fichier.                                                          | Objet `TIMINGS` centralisé et nommé.                                                                                       |
| Faible   | Aucun outillage de style ou de lint.                                                                                             | ESLint 10 (flat config), Prettier, EditorConfig, GitAttributes et scripts npm.                                             |
| Faible   | Documentation de développement absente.                                                                                          | Section « Development » du README et présent audit.                                                                        |

## Architecture retenue

Le fichier `src/picker-resize.js` reste volontairement un bundle unique :
le loader de `preload.js` exécute un seul script dans le monde de la page.
Le code est maintenant organisé en sections explicites dans une IIFE :

1. garde de host, drapeau d'installation et hook de test ;
2. constantes, sélecteurs Discord et helpers partagés ;
3. fonctionnalité resize ;
4. internationalisation ;
5. fonctionnalité imports GIF ;
6. CSS des imports ;
7. bootstrap et hook de test.

Le bloc `gifenc` en tête de fichier reste minifié et est exclu d'ESLint et
de Prettier. Il ne doit pas être édité à la main.

## Vérifications

```powershell
npm test           # 112 tests, 0 échec
npm run lint       # aucune erreur
npm run format:check
```

Les tests ajoutés couvrent la locale `zh-Hant-TW`, les libellés localisés du
grip, l'annulation du timer de révélation GIF, la navigation clavier du grip,
la validation de `encodeFrames` et le rendu de la vue « Importés » (y compris
l'état vide et les actions).

## Risques résiduels

- **Dépendance aux classes hashées de Discord** : `SELECTORS` centralise le
  problème mais ne l'élimine pas. Une mise à jour Discord peut nécessiter
  une adaptation de ces sélecteurs.
- **Bundle unique** : c'est une contrainte du mode d'injection. Une
  séparation en modules nécessiterait un bundler et un changement du
  processus d'installation.
- **Pas de test d'intégration Discord réel** : la suite utilise un DOM
  factice. Les comportements dépendant du vrai DOM Discord (focus, upload,
  IndexedDB) restent à valider manuellement après une mise à jour.
- **Installeur non signé** : SmartScreen peut afficher un avertissement.
  Ce point est déjà documenté dans le README.
- **`gifenc` vendu en un seul bloc minifié** : la version amont doit être
  mise à jour manuellement et le bloc reste difficile à auditer.
