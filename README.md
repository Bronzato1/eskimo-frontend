### Pour compiler le projet pour la production (Azure)

- supprimer et recréer le rép publish
- `au build --env prod`
- copier le rép scripts dans le rép publish
- copier le rép font-awesome dans le rép publish
- copier le rép images dans le rép publish
- copier le rép javascript dans le rép publish
- copier les fichiers index.html et favicon.ico dans le rép publish
- ensuite clic droit sur le répertoire publish et choisir Deploy to static website > eskimoo


| Type                | Nom           |           |                |
|---------------------|---------------|-----------|----------------|
| Groupe de ressource | eskimoGroup   |           |                |
| App service         | eskimoApp     | backend   | Web App        |
| Compte de stockage  | eskimoo       | frontend  | Static Website |

### Pour héberger un site statique sous Azure

- Storage accounts / Add
- Resource Group: AzurBlogging
- Storage account name: azurblogging
- Location West Europe
- Performance: Standard
- Account kind: StorageV2 (general purpose V2)
- Replication: Locally-redundant storage (LRS)
- Access tier (default): Hot
- Security transfert required: Enabled
- Allow access from: All networks
- Blob soft delete: Disabled
- Hierarchical namespace: Disabled
- (wait creation completed)
- (clic on it when available)
- Choose Static website in sidebar
- Static website: Enabled
- Index document name: index.html
- Index document path: index.html

