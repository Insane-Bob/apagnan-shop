# Projet semestriel E-commerce 4IW - Second semestre 2024




## Containerisation

Notre projet fonctionne avec Docker pour faciliter le déploiement et le partage des nouveautés.


--- 

## Architecture

Le projet comprend 4 composantes :

- Le backend (serveur Node API)
- Le frontend (application Vue)
- Les bases de données (MongoDB & PostgreSQL)
- Le serveur web (Nginx)

### Backend (backend) aboressance

Dossier `scripts` => fichier script npm utiles
Dossier `src` => code source du backend
  - `Core` => contient les classes de base du backend
    - `RequestHandler` => class d'entrée pour une requête express HTTP
      - `Controller` => etend RequestHandler, peut être lié a un provider
      - `Middleware` => etend RequestHandler
    - `Observer` => class d'observer pour les events
    - `Provider` => un provider permet d'auto fetch les donnée dans la db selon les params URL (ex: `/api/users/:user` => permet de provide `this.user` dans le controller) 
    - `Request` => objet request décorateur de la requête express
    - `PrametersBag` => objet de paramètres de requête inspiré de Symfony
    - `Router` => Router customisé qui se base sur express

Dossier `dabase`
  - `factories` => Nos factories pour nos tests et nos seeders
  - `migrations` => Nos migrations pour la base de données, sequelize-cli
  - `seeders` => Nos propre script de seeding pour notre base de données reposant sur nos factories

Dossier `Email` => Class d'email pour set les template brevo

Dossier `Enum` => Enum pour les différentes partie de la logique métier

Dossier `Exceptions` => Notre systeme d'exception customisé

Dossier `Http`
  - `Controller` => Nos controllers pour les routes de l'API
  - `Middleware` => Nos middlewares pour les routes de l'API
  - `Policy` => Nos règles d'accès pour les routes de l'API
  - `Provider` => Nos providers pour les routes de l'API

Dossier `Jobs` => Nos jobs pour les tâches de fond

Dossier `Lib` => Nos librairies utilitaires

Dossier `Models`
  - `Mongo` => Nos modèles pour la base de données MongoDB
  - `SQL` => Nos modèles pour la base de données PostgreSQL

Dossier `Observers` => Nos class d'observer pour les events

Dossier `Routes` => Nos routes pour l'API lu et interprété par le Router

Dossier `Services` => Nos services pour la logique métier

Dossier `tests` => Nos outils de tests

Dossier `Utils` => Nos utilitaires

Dossier `Validators` => Nos validateurs pour les données

---

# Getting Started

## TUTORIEL 

### Lancement local

Pour lancer en local, il faut :

- Créer un fichier `.env` à la racine :
    ```txt
    NODE_ENV=development
    ```

- Créer les fichiers `.env` dans les sous-dossiers `backend` et `frontend` selon les `.env.example` respectifs.

- Lancer Docker Compose :
    ```bash
    docker-compose up
    ```

- Lancer les migrations :
    ```bash
    docker-compose run backend npx sequelize-cli db:migrate
    ```

En développement, vous pouvez accéder à l'API sur http://localhost
et au frontend sur http://localhost:5173.

### Lancement en production

Pour lancer en production, il faut :

- Créer un fichier `.env` à la racine :
    ```txt
    NODE_ENV=development # garder development pour le moment
    ```

- Créer les fichiers `.env` dans les sous-dossiers `backend` et `frontend` selon les `.env.example`.

- Lancer Docker Compose :
    ```bash
    docker-compose up
    ```

- Transpiler le backend :
    ```bash
    docker-compose run backend npm run build
    ```

- Builder le frontend :
    ```bash
    docker-compose run frontend npm run build
    ```

- Modifier le fichier `.env` à la racine :
    ```txt
    NODE_ENV=production # changer cette variable a un impact sur la base de données utilisée et sur le lancement du serveur backend
    ```

- Arrêter Docker Compose :
    ```bash
    docker-compose down
    ```

- Relancer Docker Compose avec uniquement Nginx (Nginx sert par défaut le `frontend/dist`, améliorant les performances) :
    ```bash
    docker-compose up backend # lance Nginx, le backend et les bases de données
    ```

--- 




