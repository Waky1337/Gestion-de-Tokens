const axios = require('axios');

const baseURL = 'http://localhost:3000';
let token = '';

async function testAPI() {
  try {
    // Vérifier que le serveur fonctionne
    console.log('Vérification du serveur:');
    const homeResponse = await axios.get(baseURL);
    console.log(homeResponse.data);

    // Se connecter et obtenir un token
    console.log('\nConnexion:');
    const loginResponse = await axios.post(`${baseURL}/login`, {
      username: 'SOGE',
      password: 'toto'
    });
    token = loginResponse.data.token;
    console.log('Token reçu:', token);

    // Accéder à une route protégée
    console.log('\nAccès à une route protégée:');
    const protectedResponse = await axios.get(`${baseURL}/protected`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(protectedResponse.data);

    // Rafraîchir le token
    console.log('\nRafraîchissement du token:');
    const refreshResponse = await axios.post(`${baseURL}/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Nouveau token:', refreshResponse.data.token);

  } catch (error) {
    console.error('Erreur:', error.response ? error.response.data : error.message);
  }
}

testAPI();