# Tests

Nous avons utilisé JEST pour effectuer nos tests unitaires et d'intégration. Nos tests concernent uniquement le backend.

## Setup

Pour faciliter l'implémentation de nos tests, nous avons mis en place des fonctions utilitaires dans le fichier `backend/tests/`.

Par exemple, nous avons une fonction `actingAs(user: USER)` qui permet de simuler la connexion d'un utilisateur sur tous les appels de l'API.

Nous avons également des fonctions liées à la base de données :

- Chaque suite de tests JEST crée une nouvelle base de données temporaire pour éviter les conflits entre les tests. Nous utilisons la méthode `useFreshDatabase()` ou `useFreshMongo()` pour ouvrir une nouvelle base de données.

## Tests des Controllers
> Dossier : `backend/src/Http/Controller`  
> Fichiers : `*.test.js`

Dans les tests des controllers, vous trouverez des tests fonctionnels des différentes routes de l'API ainsi que certains tests unitaires des méthodes des controllers.

Exemples :

- `ProductController.test.js` : Tests unitaires sur le flux de stock.
- `PaymentController.test.js` : Tests fonctionnels pour le paiement ainsi que le webhook Stripe (élément sensible de notre logique métier).

## Tests des Services
> Dossier : `backend/src/Services`  
> Fichiers : `*.test.js`

Nous aurions voulu réaliser des tests unitaires pour les services, mais par manque de temps, nous nous sommes contentés de faire des tests fonctionnels des controllers pour obtenir une couverture maximale (incluant les services).

Exemples :

- `TokenServices.test.js` : Tests unitaires des méthodes du service TokenServices.
- `UserServices.test.js` : Tests unitaires des méthodes du service UserServices.

## Test Authentification
> Fichier : `backend/src/Http/Middleware/AuthMiddleware.test.js`

Des tests unitaires ont été mis en place pour vérifier le comportement du middleware d'authentification selon le token d'accès fourni. D'autres tests plus fonctionnels ont été réalisés pour tester les politiques de nos routes dans les tests des controllers.

## Tests des tâches de dénormalisation
> Dossier : `backend/src/lib/Denormalizer/tasks`  
> Fichiers : `*.test.js`

### Contexte

Notre projet nécessite que, dès qu'un certain modèle SQL (sequelize) est créé, modifié ou supprimé, les données soient dénormalisées dans une collection MongoDB. Cette configuration est définie dans le modèle SQL.

Exemple pour le modèle `backend/src/Models/SQL/user.js` :

```js
User.registerDenormalizerTask(
    new ProductDenormalizationTask()
        .when([DenormalizerTask.EVENT.UPDATED])
        .on(['firstName', 'lastName'])
        .from(async (user) => {
            let reviews = await user.getReviews()
            return await Promise.all(
                reviews.map((review) => review.getProduct()),
            )
        }),
)
```

Ici, nous spécifions que dès lors que le USER est mis à jour sur les champs `firstName` et `lastName`, tous les produits liés à ses reviews dans la collection MongoDB doivent être mis à jour via `ProductDenormalizationTask`.

### Particularité des tests de dénormalisation

Assurer que les tâches de dénormalisation s'exécutent dans le bon ordre et ne se chevauchent pas avec d'autres tâches de dénormalisation lancées par des requêtes concurrentes est crucial. Pour éviter ce problème, nous avons mis en place un système de file d'attente de tâches de dénormalisation (`DenormalizerQueue`).

Cependant, cette queue crée un processus asynchrone qui peut empêcher la fin du test. Nous avons donc décidé de désactiver la dénormalisation dans les tests, sauf dans les tests dédiés à la dénormalisation.

```js
// backend/src/lib/Denormalizer/DenormalizerQueue.js
class DenormalizerQueue {
  //...
  async enqueue(task) {
    this.queue.push(task)
    this.process().then()
    return true
  }

  async process() {
    if (process.env.NODE_ENV === 'test') return
    //...
  }
  //...
}
```

Pour activer la dénormalisation dans un test spécifique, nous devons simuler la classe `DenormalizerQueue` pour que l'exécution se fasse de manière synchrone.

```js
const denormalizerQueue = DenormalizerQueue.getInstance()
denormalizerQueue.enqueue = jest.fn((task) => task.execute())
```

Nous modifions ainsi la méthode `enqueue` pour qu'elle exécute directement la tâche de dénormalisation sans la placer dans la queue.

## Les factories

Nous nous sommes inspirés d'autres frameworks comme Laravel pour mettre en place des factories pour nos tests et aussi pour nos seeds. Toutes nos factories se trouvent dans le dossier `backend/src/database/factories` et permettent d'instancier rapidement des objets dans la base de données SQL (qui sont ensuite dénormalisés dans la base de données MongoDB si la dénormalisation est activée pour le test).