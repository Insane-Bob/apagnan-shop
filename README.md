# Getting Started

## Introduction
### Objectif

Nous avons décidé de vous présenter notre projet sous forme de guide pour vous aider à comprendre comment nous implémentons et avons conçu notre API e-commerce. La partie frontend étant une application Vue, nous la mettrons un peu plus en retrait.

Notre backend est inspiré des frameworks Symfony et Laravel. Il est conçu pour être extensible et utilisable pour d'autres projets d'API.

## Installation et Configuration (Environment dev)

### Étape 2 : Configuration des fichiers d'environnement
Créez un fichier `.env` à la racine du projet :
```txt
NODE_ENV=development
```
Ensuite, créez les fichiers `.env` dans les sous-dossiers `backend` et `frontend` en vous basant sur les fichiers `.env.example` respectifs.

### Étape 3 : Lancer Docker Compose
```bash
docker compose up
```

### Étape 4 : Lancer les migrations
```bash
docker compose run backend npm run migrate
```

Pour s'assurer que le backend soit toujours bien lancé, on peut restart le service : 
```bash
docker compose restart backend
```

En développement, accédez à l'API sur [http://localhost/api](http://localhost/api) et au frontend sur [http://localhost:5173](http://localhost:5173).

## Structure du Projet

### Architecture Générale
Notre projet comprend quatre composantes (services Docker) principales :
1. **Backend (Node API)**
2. **Frontend (Vue.js)**
3. **Bases de données (MongoDB & PostgreSQL)**
4. **Serveur Web (Nginx)**

### Détails du Backend

#### Dossier `scripts`
Contient des scripts npm utiles pour diverses tâches.

#### Dossier `src`
- **Core**
  - `RequestHandler` : Classe d'entrée pour une requête HTTP Express.
    - `Controller` : Étend `RequestHandler`, peut être lié à un provider.
    - `Middleware` : Étend `RequestHandler`.
  - `Observer` : Classe pour les événements.
  - `Provider` : Auto-fetch des données dans la base de données selon les paramètres d'URL.
  - `Request` : Objet décorateur de la requête Express.
  - `ParametersBag` : Objet de paramètres de requête inspiré de Symfony.
  - `Router` : Router customisé basé sur Express.

- **database**
  - `factories` : Factories pour tests et seeders.
  - `migrations` : Migrations pour la base de données.
  - `seeders` : Scripts de seeding.

- **Email**
  - Gestion des templates d'email avec Brevo.

- **Enum**
  - Enums pour la logique métier.

- **Exceptions**
  - Système d'exception personnalisé.

- **Http**
  - `Controller` : Controllers pour les routes API.
  - `Middleware` : Middlewares pour les routes API.
  - `Policy` : Règles d'accès.
  - `Provider` : Providers pour les routes API.

- **Jobs**
  - Tâches de fond.

- **Lib**
  - Librairies utilitaires.

- **Models**
  - `Mongo` : Modèles pour MongoDB.
  - `SQL` : Modèles pour PostgreSQL.

- **Observers**
  - Observers pour les événements.

- **Routes**
  - Routes pour l'API.

- **Services**
  - Services pour la logique métier.

- **tests**
  - Outils de tests.

- **Utils**
  - Utilitaires.

- **Validators**
  - Validateurs pour les données.

## Fonctionnalités du backend

### Middlewares
Les middlewares se trouvent dans `src/Http/Middleware`. Ils traitent les requêtes avant qu'elles n'atteignent les controllers. Ici on se base sur les middlewares d'Express, nous les avons juste déportés dans une classe pour garder une bonne structure au projet.

```js
class FooMiddleware extends Middleware{
    handle(req, res, next){
        req.headers.set('foo', 'bar');
        next();
    }
}
```

### Providers
Les providers se trouvent dans `src/Http/Provider`. Ils permettent d'auto-fetch des données en fonction des paramètres d'URL.


```js
export class UserProvider extends Provider{
  static param = 'user' 
  static model = 'User'
  // toutes les routes avec :user dans l'uri et qui aurons le provider de définis seront provide par ce provider
  
  
  fetch(model, paramValue) {
    //orverride de Provider.prototype.fetch => return model.findByPk(paramValue) fetch par default dans Provider (optionel)
    return model.findOne({
      where:{
          email:"foo@email.com"
      }
    })
  }
}
```

### Controllers
Les controllers se trouvent dans `src/Http/Controller`. Chaque controller étend `RequestHandler` et gère les requêtes HTTP. Exemple :
```javascript
class UserController extends Controller {
    show() {
        this.res.json(this.user); //user est fourni automatiquement par le provider UserProvider
    }
}
```

### Routes
Le fichier `src/Routes` contient toutes les routes de l'API. Chaque fichier de routing peut définir plusieurs routes :
```js
router.group('/api/users/:user', function () {
    this.get('/', UserController, 'show')
        .middleware(/*...*/)
        .provide(/*...*/)
}).middleware(AuthMiddleware).provide(UserProvider);
```
On peut spécifier des `group` pour appliquer une configuration à plusieurs routes. C'est aussi à cet endroit qu'on spécifie les `Middleware` et les `Providers` nécessaires à nos routes.

### Validators
Les validateurs se trouvent dans `src/Validators`. Ils vérifient la validité des données avant de les traiter. Ils fonctionnent avec des schémas zod et sont utilisés dans les controllers de la manière suivante :

```js
class UserValidator extends Validator {
    constructor() {
        super(UserValidator.schema());
    }
    
    static schema(){
        return z.object({
            email: z.string().email(),
            password: z.string()
        });
    }
}

class UserController extends Controller {
    create() {
        const payload = this.validate(UserValidator);
        //payload ne contient que les champs nécessaires présents dans les params, les query, et le body de la request.
    }
}
```

### Policies
Les policies se trouvent dans `src/Http/Policies`. Elles vérifient que l'utilisateur connecté peut effectuer ou non une action. Ce sont des classes statiques exportant uniquement des méthodes statiques. Si la policy renvoie false, une ForbiddenException est automatiquement renvoyée au client et le reste du code n'est pas exécuté.

```js
class UserPolicy {
    static show(user, userResource) {
        return Number(user.id) === Number(userResource.id);
    }
}
class UserController extends Controller {
    show() {
        this.can(UserPolicy.show, this.user);
        this.res.json(this.user);
    }
}
```

### Exceptions
Nous utilisons pour toutes nos erreurs HTTP des exceptions personnalisées qui étendent `HTTPException`. Cette classe nous fournit des méthodes rapides à utiliser dans toute notre base de code. Toutes les erreurs même hors `HTTPException` sont catch au niveau de la méthode `handleRequest` de la classe `RequestHandler`. C'est le point d'entrée entre Express et notre framework.

```js
function foo(){
    let maVariable = "bar";
    UnauthorizedException.abortIf(maVariable != "foo", "Mon message"); // throw UnauthorizedException
    // ce code n'est pas exécuté
    maVariable = "foo";
}
```

---

## Déploiement

### Lancement en Production

Pour lancer en production :

1. Configurez les fichiers `.env` comme décrit dans la section installation.
2. Lancer Docker Compose :
    ```bash
    docker-compose up
    ```
3. Transpilez le backend :
    ```bash
    docker-compose run backend npm run build
    ```
4. Construisez le frontend :
    ```bash
    docker-compose run frontend npm run build
    ```
5. Changez `NODE_ENV` à `production` dans `.env`.
6. Redémarrez Docker Compose (backend seulement):
    ```bash
    docker-compose down
    docker-compose up backend
    ```
---

## GitHub Actions -> Tests et Déploiement

Nous avons deux actions GitHub :

### Les tests (backend uniquement)

Les tests sont lancés à chaque ouverture de PR, et sont relancés à chaque push sur une PR.
Fichier : `/github/workflows/backend-test.yml`

### Le déploiement

Le déploiement suit globalement les étapes décrites dans la section "Lancement en production". Il build le backend et le frontend au niveau du job GitHub pour ne pas charger notre serveur et profiter des ressources de leur serveur. Ensuite, il upload les artefacts sur notre serveur de production et déploie l'application en lançant uniquement Nginx, le backend et les bases de données.
Fichier : `/github/workflows/deploy.yml`
