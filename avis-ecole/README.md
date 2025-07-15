# 🏫 Avis École – Plateforme d'avis avec modération OpenAI

Ce projet permet aux élèves de laisser des **avis notés et modérés** sur leurs camarades ou professeurs, en toute sécurité.

## 🚀 Déploiement sur Render

### Étapes complètes

1. Va sur https://render.com
2. Clique sur **New > Web Service**
3. Connecte ton dépôt GitHub contenant ce projet
4. Configure :

| Option                | Valeur                |
|-----------------------|------------------------|
| Name                  | avis-ecole             |
| Root Directory        | avis-ecole             |
| Environment           | Node                   |
| Build Command         | `npm install`          |
| Start Command         | `npm start`            |
| Branch                | `main`                 |

5. Ajoute la variable d’environnement :

- Key : `OPENAI_API_KEY`
- Value : ta clé OpenAI (commence par `sk-...`)

6. Clique sur **Create Web Service**

Après 2-3 minutes, le site est en ligne !

## 📁 Fichiers

- `index.js` : serveur Node.js + modération OpenAI
- `public/` : page HTML avec JS/CSS
- `avis.json` : base d’avis en JSON
- `package.json` : dépendances (express, cors, body-parser, openai)

## 📦 Commandes Git à utiliser :

```bash
git init
git add .
git commit -m "Version modérée avec OpenAI"
git remote add origin https://github.com/TON_COMPTE/avis-ecole.git
git branch -M main
git push -u origin main
```

🧠 **Créé par Ramzan M. Udvardi (RZ)**
