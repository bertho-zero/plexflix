
## Configurer Plex

- Se connecter via Plex
- Ajouter une bibliothèque "Films" vers `/Movies`
- Ajouter une bibliothèque "Séries TV" vers `/Series`
- Dans les paramètres "Library" du serveur, cocher :
  - "Scan my library automatically"
  - "Run a partial scan when changes are detected"
  - "Scan my library periodically" (15 minutes)

## Configurer Overseerr

- Se connection via Plex
- Configurer Plex en séléctionnant les 2 bibliothèques
- Laisser les paramètres Radaar et Sonarr

## Ajouter des indexers

Pour que Radarr et Sonarr puissent chercher et télécharger du contenu automatiquement il faut ajouter un ou plusieurs indexers à Prowlarr.

## Récupérer l'historique Tautulli dans Overseerr

Suivez les étapes de connexion et ajoutez le serveur Tautulli à Overseerr avec l'host `http://tautulli` et votre clé API.

### Pour demander et autoriser automatiquement les demandes

Allez sur [vos paramètres](http://localhost:5055/profile/settings) puis cochez "Auto-Request Movies" et "Auto-Request Series" sans oublier de sauvegarder.

Dans les [paramètres des utilisateurs](http://localhost:5055/settings/users) cochez "Auto-Approve" et "Auto-Request" puis sauvegardez.
