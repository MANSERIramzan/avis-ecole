const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'avis.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let avis = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    avis = JSON.parse(data);
  }
} catch (err) {
  console.error('Erreur lecture fichier:', err);
}

function avisEstValide(commentaire) {
  if (!commentaire || commentaire.trim().length < 10) return false;
  const seulementLettres = /^[a-zA-ZÀ-ÿ\s]+$/.test(commentaire);
  const contientAuMoinsUnMot = commentaire.trim().split(/\s+/).length >= 3;
  const lettresUniques = new Set(commentaire.toLowerCase().replace(/[^a-z]/g, '')).size;
  return !(seulementLettres && lettresUniques <= 2) && contientAuMoinsUnMot;
}

app.get('/avis', (req, res) => res.json(avis));

app.post('/avis', async (req, res) => {
  const { nomPersonne, auteur, commentaire, note } = req.body;
  if (!nomPersonne || !auteur || !commentaire || !note) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  if (!avisEstValide(commentaire)) {
    return res.status(400).json({ error: "Ton avis n'est pas assez clair ou trop court." });
  }

  try {
    const moderationRes = await openai.moderations.create({ input: commentaire });
    if (moderationRes.results[0].flagged) {
      return res.status(403).json({ error: "Ton commentaire contient des propos non autorisés." });
    }
  } catch (err) {
    console.error("Erreur OpenAI:", err.message);
    return res.status(500).json({ error: "Erreur serveur (modération)." });
  }

  const newAvis = { id: Date.now(), nomPersonne, auteur, commentaire, note };
  avis.unshift(newAvis);
  fs.writeFileSync(DATA_FILE, JSON.stringify(avis, null, 2));
  res.json(newAvis);
});

app.delete('/avis/:id', (req, res) => {
  const id = Number(req.params.id);
  avis = avis.filter(a => a.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(avis, null, 2));
  res.json({ message: 'Supprimé' });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});