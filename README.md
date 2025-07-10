[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/Protocol-MCP-orange.svg)](https://modelcontextprotocol.io/)

## C'est quoi MCP ?

Model Context Protocol (MCP) est un protocole de communication standardisé qui permet à des clients LLM (local ou distant) d'interagir avec des systèmes externes (bases de données, APIs, services web, systèmes de fichiers).

### Architecture

MCP repose sur 3 composants principaux :

1. **Serveur MCP** : Service qui expose des ressources ou fonctionnalités spécifiques
2. **Client MCP** : Application qui consomme les services exposés par les serveurs
3. **Transport Layer** : Mécanisme de communication entre client et serveur

### Le fonctionnement

```
Client MCP ←→ Transport Layer ←→ Serveur MCP
```

Le client initie une connexion avec le serveur via l'un des transports supportés :
- **stdio** : Communication via entrée/sortie standard
- **WebSocket** : Communication réseau bidirectionnelle
- **HTTP** : Communication requête/réponse traditionnelle


Le serveur MCP expose ses capacités via des schémas structurés :
- **Tools** : Fonctions exécutables (lecture fichier, requête API, calcul)
- **Resources** : Données accessibles (documents, bases de données, logs)
- **Prompts** : Templates de requêtes prédéfinies


### Avantages techniques

#### Sécurité
- **Isolation** : Chaque serveur MCP s'exécute dans un environnement isolé
- **Contrôle d'accès** : Permissions granulaires sur les ressources
- **Audit** : Traçabilité complète des interactions

#### Scalabilité
- **Parallélisation** : Exécution simultanée de multiples serveurs
- **Distribution** : Déploiement sur différents nœuds réseau
- **Load Balancing** : Répartition automatique des charges

#### Maintenabilité
- **Modularité** : Séparation claire des responsabilités
- **Versioning** : Gestion des évolutions de protocole
- **Standardisation** : Format uniforme des échanges


Découvrez mes projets MCP dans ce repo, n'hésitez pas à contribuer et poser des questions si besoin !
