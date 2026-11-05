# Vencord Expression Picker Resize

**A larger, resizable and persistent GIF / emoji picker for Vencord on Windows.**
One-click installer, no Vencord build required.

![Aperçu](assets/preview.svg)

## Fonctionnalités

- Sélecteur GIF / autocollants / émojis beaucoup plus grand par défaut.
- Redimensionnement **largeur + hauteur** avec une petite poignée discrète
  intégrée dans le coin haut-gauche.
- Taille mémorisée entre les ouvertures et les redémarrages
  (largeur via Discord, hauteur dans `size.json`).
- Plus de flash bleu : les tuiles GIF restent sombres jusqu'au chargement de
  la première image, puis apparaissent en fondu.
- Reste en place après une mise à jour de Discord.
- Reste en place après une mise à jour de Vencord grâce à un petit watcher.

## Pourquoi pas un plugin Vencord ?

L'installateur officiel de Vencord ne charge pas de plugins externes :
les `userplugins` ne sont pris en charge que dans une build Vencord
compilée depuis les sources. Pour un utilisateur normal, cela impliquerait
Node.js, pnpm, git et une compilation complète.

Ce projet utilise donc une approche plus simple : un petit script injecté
dans le renderer via `preload.js`, avec un watcher qui réapplique le hook
après les mises à jour de Vencord. Aucune build Vencord n'est nécessaire.

## Installation

1. Télécharge la dernière release :
   <https://github.com/quentingimenez/vencord-expression-picker-resize/releases/latest>
2. Extrais le ZIP.
3. Ferme Discord (recommandé).
4. Double-clique sur **`install.cmd`**.
5. Relance Discord.

> Windows 10/11, Discord desktop et Vencord installé avec l'installateur
> officiel. Vesktop et BetterDiscord ne sont pas pris en charge.

## Utilisation

Ouvre le sélecteur GIF depuis la barre de message. Une petite poignée
diagonale se trouve dans le coin **haut-gauche** du panneau :

- glisse vers le haut/gauche pour agrandir ;
- glisse vers le bas/droite pour réduire ;
- la taille est mémorisée automatiquement.

La poignée native de largeur sur le bord gauche est masquée ; la poignée
personnalisée gère les deux dimensions.

## Désinstallation

Double-clique sur **`uninstall.cmd`**, puis relance Discord.

L'installateur crée une sauvegarde de `preload.js` dans
`preload.js.bak-picker-resize` et la restaure lors de la désinstallation.

## Mises à jour

- **Discord** : Vencord repatche automatiquement le nouvel app.asar ;
  aucune action nécessaire.
- **Vencord** : le watcher surveille `%APPDATA%\Vencord\dist\preload.js` et
  réapplique le loader automatiquement. Si la poignée disparaît après une
  mise à jour, relance `install.cmd` puis redémarre Discord.

## Comment ça marche

L'installateur :

1. copie `picker-resize.js` et `watcher.ps1` dans
   `%LOCALAPPDATA%\VencordPickerResize\` ;
2. ajoute un loader à `%APPDATA%\Vencord\dist\preload.js` ;
3. crée `VencordPickerResize.vbs` dans le dossier Démarrage ;
4. lance le watcher, qui maintient le loader après les mises à jour.

Le script et la taille sont stockés en dehors de Vencord, donc une
réinstallation de Vencord ne les supprime pas. Aucun réseau, aucune
télémétrie.

## Dépannage

- **« Vencord was not found »** : Vencord n'est pas installé au chemin
  standard, ou tu utilises Vesktop. Ce projet cible l'installateur officiel.
- **Rien ne se passe après le redémarrage** : relance `install.cmd`, puis
  redémarre Discord. Vérifie que
  `%APPDATA%\Vencord\dist\preload.js` contient
  `VC_PICKER_RESIZE_LOADER_START`.
- **La poignée a disparu après une mise à jour** : le watcher n'était
  probablement pas lancé. Relance `install.cmd`.
- **Antivirus / PowerShell** : les scripts sont lisibles et ne font que
  copier des fichiers locaux et modifier `preload.js`. `install.cmd` lance
  PowerShell avec `-ExecutionPolicy Bypass` pour éviter le blocage des
  scripts non signés.

## Avertissement

Projet non officiel, non affilié à Discord ni à Vencord. Modifier
`preload.js` peut casser après une mise à jour incompatible. Utilise-le à
tes propres risques.

## Licence

MIT — voir [LICENSE](LICENSE).
