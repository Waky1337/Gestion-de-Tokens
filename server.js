const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const SECRET_KEY = 'votre_clé_secrète_très_sécurisée';

// Simulez une base de données d'utilisateurs
const users = [
  { id: 1, username: 'SOGE', password: '$2a$12$k1dYVWxkLqUB98MF4onNbuqjagpXlga6LrvUHa76K6m3EjJ8EzYnO' }, // Mot de passe hashé pour 'password123'
];

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h' // Le token expire après 1 heure
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Authentification échouée' });
  }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ceci est une route protégée', user: req.user });
});

app.post('/refresh-token', authenticateToken, (req, res) => {
  const newToken = generateToken(req.user);
  res.json({ token: newToken });
});

// Nouvelle route pour vérifier un token
app.post('/verify-token', (req, res) => {
  const token = req.body.token || req.query.token;

  if (!token) {
    return res.status(400).json({ message: 'Token non fourni' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide', valid: false });
    }
    
    // Le token est valide
    res.json({ 
      message: 'Token valide', 
      valid: true, 
      decoded: {
        id: decoded.id,
        username: decoded.username,
        exp: decoded.exp
      }
    });
  });
});

// Route de test pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Serveur d\'authentification opérationnel' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
