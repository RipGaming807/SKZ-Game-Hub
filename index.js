const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/games', express.static(path.join(__dirname, 'games')));

const gamesFile = path.join(__dirname, 'games.json');

// === Load games.json or initialize ===
if (!fs.existsSync(gamesFile)) fs.writeJsonSync(gamesFile, []);

// === Upload Configuration ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const gameFolder = path.join(__dirname, 'games', req.body.name);
    fs.ensureDirSync(gameFolder);
    cb(null, gameFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// === Upload Route ===
app.post('/upload', upload.any(), async (req, res) => {
  const { name, thumbnail } = req.body;

  const newGame = {
    id: Date.now().toString(),
    title: name,
    thumbnail: thumbnail,
    url: `https://${req.headers.host}/games/${name}/index.html`
  };

  const games = await fs.readJson(gamesFile);
  games.push(newGame);
  await fs.writeJson(gamesFile, games);

  res.json({ success: true, message: 'Game uploaded!', game: newGame });
});

// === List Games ===
app.get('/games', async (req, res) => {
  const games = await fs.readJson(gamesFile);
  res.json(games);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
