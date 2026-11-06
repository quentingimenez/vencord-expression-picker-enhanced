# Audit de qualité — Vencord Expression Picker Enhanced

Date : 2026-11-06

## Résumé

Le projet fonctionnait et sa suite de tests était verte, mais le cœur du
module renderer (alors `src/picker-resize.js`, aujourd'hui découpé dans
`src/renderer/`, ~3 000 lignes) accumulait
plusieurs problèmes de maintenabilité : deux IIFE indépendantes, des helpers
dupliqués, des sélecteurs Discord éparpillés, deux boucles de polling, une
localisation incomplète du grip et plusieurs chemins d'erreur qui pouvaient
laisser l'UI dans un état bloqué.

L'audit a été suivi d'un refactor sans changement fonctionnel volontaire,
validé par les 104 tests existants puis par 8 tests ajoutés (112 au total).
Le durcissement décrit plus bas porte la suite à 119 tests, puis la dernière
passe d'architecture et d'intégration à 137 tests, et le support macOS/Linux
à 144 tests.

## Constats et corrections

| Sévérité | Constat                                                                                                                                   | Correction                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Élevée   | Deux IIFE séparées dupliquaient le garde de host, le drapeau d'installation et le hook de test.                                           | Une seule IIFE de bootstrap, un seul garde, un seul hook, un seul timer de maintenance.                                               |
| Élevée   | `setInterval(maintain, 250)` et `setInterval(tick, 300)` interrogeaient le DOM en parallèle.                                              | `maintain()` appelle désormais `initDrawer()` ; le timer de resize a été supprimé.                                                    |
| Élevée   | `handleFiles()` pouvait laisser `busy = true` et le bouton désactivé si une exception inattendue survenait.                               | Bloc `try/finally` : l'état occupé est toujours réinitialisé.                                                                         |
| Élevée   | `uploadManager.addFile()` pouvait jeter sans retour utilisateur.                                                                          | Try/catch avec message localisé `attachFailed`.                                                                                       |
| Moyenne  | Les sélecteurs Discord (`backButton_fed6d3`, `result__2dc39`, etc.) étaient répétés dans une dizaine de fonctions.                        | Objet `SELECTORS` centralisé et documenté.                                                                                            |
| Moyenne  | Le calcul des correspondances avec les favoris natifs était recalculé plusieurs fois par rendu et le regroupement par URL était dupliqué. | Index unique `buildImportFavoriteIndex()` (matches, par import, par chemin), mémoïsé et réutilisé par le rendu et les boutons natifs. |
| Moyenne  | Les boutons d'action (`favorite`, `delete`, `back`, `clear`) réimplémentaient `role`, `tabindex`, `aria-label`, clic et clavier.          | Helpers `createIconAction()` et `addActivationHandler()`.                                                                             |
| Moyenne  | Le libellé du grip était codé en français en dur.                                                                                         | Clés `resizeHandle` et `resizeHandleLabel` ajoutées aux 14 langues, avec fallback anglais.                                            |
| Moyenne  | Le grip avait `role="button"` mais n'était ni focusable ni utilisable au clavier.                                                         | `tabindex="0"`, flèches (Shift pour un pas plus grand), style `:focus-visible` et test dédié.                                         |
| Moyenne  | `Intl.PluralRules` et la recherche de locale étaient recréés à chaque appel.                                                              | Cache des règles de pluriel et index des locales.                                                                                     |
| Moyenne  | Les accès à `window.Vencord` et `findByProps` étaient répétés avec des try/catch ad hoc.                                                  | Helpers `getVencord()`, `getWebpack()`, `getWebpackCommon()`, `findByProps()`.                                                        |
| Moyenne  | Les transactions IndexedDB de lecture/écriture étaient dupliquées et `dbPromise` restait rejetée après une erreur.                        | `requestAsPromise()`, `runWriteTransaction()`, réinitialisation de `dbPromise` sur échec.                                             |
| Faible   | Le statut d'import n'était pas annoncé aux lecteurs d'écran et la vue « Importés » n'avait pas de rôle.                                   | `role="status"` + `aria-live="polite"` et `role="region"` + `aria-label`.                                                             |
| Faible   | Le canvas et l'encodage d'une frame étaient dupliqués entre image animée, image statique et vidéo.                                        | Helpers `createCanvas()`, `captureFrame()`, `encodeSingleFrame()`.                                                                    |
| Faible   | `seekVideo()` dupliquait le nettoyage timeout/listener sur chaque branche.                                                                | Fonction `settle()` unique avec nettoyage centralisé.                                                                                 |
| Faible   | Le timer de révélation GIF n'était jamais annulé après un chargement réussi.                                                              | Timer stocké et annulé par `reveal()`.                                                                                                |
| Faible   | Le loader préload acceptait une hauteur initiale > 5000 px alors que le renderer la refusait.                                             | Bornes `__vcPickerMinHeight` / `__vcPickerMaxHeight` appliquées à la lecture et à l'écriture.                                         |
| Faible   | `Copy-IfDifferent` ne comparait que les chemins, pas les contenus.                                                                        | `Copy-FileIfChanged` compare les hash SHA-256.                                                                                        |
| Faible   | Le watcher PowerShell ne vérifiait pas le code de sortie de l'installateur et pouvait mourir sur une erreur de surveillance.              | Vérification de `$LASTEXITCODE`, logs explicites et boucle protégée.                                                                  |
| Faible   | `Installer.cs` appelait `WaitForExit()` deux fois et dupliquait le numéro de version.                                                     | Appel unique documenté ; version dérivée de l'assembly.                                                                               |
| Faible   | Les délais (250, 3500, 10 000, etc.) étaient dispersés dans le fichier.                                                                   | Objet `TIMINGS` centralisé et nommé.                                                                                                  |
| Faible   | Aucun outillage de style ou de lint.                                                                                                      | ESLint 10 (flat config), Prettier, EditorConfig, GitAttributes et scripts npm.                                                        |
| Faible   | Documentation de développement absente.                                                                                                   | Section « Development » du README et présent audit.                                                                                   |

## Architecture retenue

Le renderer est toujours livré sous forme d'un bundle unique, car le loader
de `preload.js` exécute un seul script dans le monde de la page. Le source
n'est plus un fichier monolithique : il est découpé en fragments sous
`src/renderer/` :

1. `01-guard.js` : garde de host, drapeau d'installation et hook de test ;
2. `03-core.js` : constantes, sélecteurs Discord et helpers partagés ;
3. `04-resize.js` : styles du picker et fonctionnalité resize ;
4. `05-imports-constants.js` à `15-imports-styles.js` : imports GIF,
   internationalisation, vues, favoris, maintenance, conversion et CSS ;
5. `16-main.js` : bootstrap, timer de maintenance et hook de test.

`scripts/build-renderer.js` concatène ces fragments dans l'ordre, vérifie que
la liste est complète et écrit `dist/picker-resize.js`. Le bundle généré est
la seule entrée utilisée par l'installeur et par les tests ; il ne doit pas
être édité à la main.

Le bloc `gifenc` reste vendu dans `src/renderer/02-gifenc.js`, minifié et
exclu d'ESLint et de Prettier. Il ne doit pas être édité à la main.

## Vérifications

```powershell
npm run build      # génère dist/picker-resize.js
npm test           # 137 tests, 0 échec
npm run lint       # aucune erreur
npm run format:check
npm run build:check
```

Les tests ajoutés couvrent la locale `zh-Hant-TW` et `zh-HK`, les libellés
localisés du grip, l'annulation du timer de révélation GIF, la navigation
clavier du grip et sa recréation après un re-render, la validation de
`encodeFrames`, la conversion d'images animées et de vidéos, la maintenance
de l'UI, la restauration de catégorie, la cohérence des traductions, la
cohérence des versions et un cycle install/uninstall complet dans une
arborescence Vencord temporaire.

## Risques résiduels

- **Dépendance aux classes hashées de Discord** : les sélecteurs utilisent
  maintenant des préfixes stables (`backButton_`, `result_`, `gif_`) et la
  classe exacte des cartes est découverte à l'exécution. Les classes natives
  utilisées comme hooks de style sont regroupées dans `NATIVE_CLASSES`. Une
  refonte complète du DOM Discord peut toujours nécessiter une adaptation.
- **Bundle unique** : c'est une contrainte du mode d'injection. Le source est
  désormais découpé en fragments et assemblé par `scripts/build-renderer.js`,
  donc cette contrainte ne pèse plus sur la navigation dans le code.
- **Pas de test d'intégration Discord réel** : la suite utilise un DOM
  factice. Les comportements dépendant du vrai DOM Discord (focus, upload,
  IndexedDB) restent à valider manuellement après une mise à jour.
- **Installeur non signé** : SmartScreen peut afficher un avertissement.
  Ce point est déjà documenté dans le README.
- **`gifenc` vendu en un seul bloc minifié** : la version amont doit être
  mise à jour manuellement et le bloc reste difficile à auditer.

## Durcissement appliqué

- écriture atomique et vérifiée de `preload.js` (installation et
  désinstallation) ;
- refus de patcher un `preload.js` qui ne contient pas exactement un bloc
  loader ;
- désinstallation qui retire le bloc du fichier courant au lieu de restaurer
  un backup potentiellement périmé ;
- watcher résilient à l'absence de Vencord, à un dossier supprimé et aux
  instances multiples ;
- isolation de chaque étape du renderer (`safeRun`), boucle de maintenance
  démarrée avant les initialisations optionnelles ;
- sélecteurs Discord par préfixes et classe de carte découverte à
  l'exécution ;
- styles autonomes pour les contrôles injectés, même si les classes
  Discord changent.

## Dernière passe (2026-11-06)

- découpage du renderer en fragments `src/renderer/*.js` et génération de
  `dist/picker-resize.js` par `scripts/build-renderer.js` ;
- index des favoris mémoïsé et invalidé par signature, pour éviter de le
  reconstruire toutes les 250 ms ;
- `reflowRootGrid()` ne réécrit plus les styles inchangés ;
- recherche des imports débouncée pour éviter un rendu complet à chaque
  frappe ;
- grip recréé si Discord le retire sans remplacer le drawer ;
- classes natives réservées aux hooks de style regroupées dans
  `NATIVE_CLASSES`, avec un état favori aussi exposé via `aria-pressed` ;
- restauration de catégorie basée sur le libellé réellement affiché, plus sur
  la valeur du champ de recherche ;
- désinstallation interrompue proprement si `preload.js` ne peut pas être
  nettoyé : l'installeur et l'entrée « Applications » sont conservés pour
  permettre une nouvelle tentative ;
- `Write-FileAtomic` conserve son backup si la restauration de secours échoue ;
- rotation et limitation des logs du watcher ;
- tests d'intégration install/uninstall dans un arbre Vencord temporaire,
  tests de conversion image/vidéo, de maintenance et de cohérence des
  traductions ;
- CI sur Node 24 avec compilation de l'installeur C# et vérification du
  bundle généré.

## Support macOS / Linux (2026-11-06)

- loader de `preload.js` partagé entre les trois plateformes : chemin
  historique `%LOCALAPPDATA%\VencordPickerResize` conservé sous Windows et
  fichiers placés dans `<Vencord>/dist/picker-resize` sous macOS/Linux, y
  compris
  pour les installations Flatpak ;
- installateur POSIX `install.sh`, désinstalleur `uninstall.sh` et helpers
  communs `src/unix-common.sh` (écriture atomique et vérifiée de
  `preload.js`, refus d'un bloc loader incomplet, conservation des fichiers
  si le nettoyage échoue) ;
- watcher POSIX `src/watcher.sh` avec verrou anti-doublon, journal limité à
  1 Mio et réapplication après chaque mise à jour de Vencord ;
- démarrage automatique par LaunchAgent sur macOS et entrée XDG autostart sur
  Linux ;
- archive `VencordExpressionPickerEnhanced-vX.Y.Z-unix.tar.gz` et
  `SHA256SUMS-unix.txt` générées par `npm run release` (ou
  `npm run release:unix`) ;
- CI matrice Windows, Ubuntu et macOS, avec test install/uninstall réel sous
  macOS/Linux.
