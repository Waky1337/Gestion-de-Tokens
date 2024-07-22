const axios = require('axios');

const serverUrl = 'http://localhost:3000'; // Assurez-vous que c'est l'URL correcte de votre serveur

async function verifyToken(token) {
  try {
    const response = await axios.post(`${serverUrl}/verify-token`, { token });
    return response.data.valid ? 'valide' : 'invalide';
  } catch (error) {
    // En cas d'erreur, on considère le token comme invalide
    return 'invalide';
  }
}

// Exemple d'utilisation
async function main() {
  const token = process.argv[2]; // Prend le token comme argument de ligne de commande
  if (!token) {
    console.log("Veuillez fournir un token en argument.");
    process.exit(1);
  }

  const result = await verifyToken(token);
  console.log(result);
}

// Exécute la fonction principale si ce script est exécuté directement
if (require.main === module) {
  main();
}

// Exporte la fonction pour pouvoir l'utiliser dans d'autres scripts
module.exports = verifyToken;
