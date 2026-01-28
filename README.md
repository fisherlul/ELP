# ELP

## Structure du dépôt

```
.
├── elm/        # Code source Elm
├── go/         # Code source Go (ex. implémentation de Levenshtein)
├── js/         # Code source JavaScript
└── README.md   # Documentation du projet
```

---

## Détails par langage

### `go/`

Contient les implémentations en Go.  
Actuellement :
- Code lié à la **distance de Levenshtein**

Pour exécuter le code Go :

```bash
cd go
go run .
```

---

### `js/`

Contient des implémentations et expérimentations en JavaScript.

Pour exécuter un fichier JavaScript :

```bash
cd js
node <fichier>.js
```

---

### `elm/`

Contient le code écrit en Elm.

Pour compiler le projet Elm :

```bash
cd elm
elm make src/Main.elm
```

---

## Prérequis

Selon le langage utilisé :

- **Go** ≥ 1.20
- **Node.js** ≥ 18
- **Elm** ≥ 0.19

---

## Contributions

Les contributions sont les bienvenues.

```bash
git checkout -b feature/ma-fonctionnalite
git commit -m "Description du changement"
git push origin feature/ma-fonctionnalite
```

