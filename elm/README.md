# TcTurtle – Interpréteur de Turtle Graphics en Elm
Huy Hung NGUYEN, Joel MINGONDZA MBOUNGOU, Hanzi JIANG

---
## Prérequis
Vous devez avoir **Elm** installé sur votre machine.

Vérifiez si Elm est installé :

```bash
elm --version
```

Sinon, installez-le avec :

```bash
npm install -g elm
```

---
## Compilation du projet
Pour compiler et exécuter ce projet, allez dans le dossier elm et exécutez le module Main.elm

```
cd elm
elm make src/Main.elm
```

Cela génère un fichier HTML nommé `index.html`.

---
## Lancer l’application

Ouvrez simplement le fichier `index.html` dans votre navigateur.

Vous verrez :
- Un champ de saisie pour le code TcTurtle
- Un bouton **Render Turtle**
- Une zone d’affichage pour le dessin

---
