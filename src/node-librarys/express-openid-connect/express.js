const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;
const OIDC_BASE_URL = process.env.OIDC_BASE_URL;
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID;
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET;

// Configuration for OIDC authentication
const config = {
  authRequired: false,  // Allow access to public routes
  auth0Logout: true,    // Enable logout functionality
  secret: EXPRESS_SESSION_SECRET, // Session secret
  baseURL: 'http://localhost:3000', // Base URL of the application
  clientID: OIDC_CLIENT_ID, // OIDC client ID
  clientSecret: OIDC_CLIENT_SECRET, // OIDC client secret
  issuerBaseURL: OIDC_BASE_URL, // OIDC issuer base URL
  authorizationParams: { // Additional parameters needed in order that the client secret is sent on the token request
    scope: 'openid', // Request the 'openid' scope for authentication 
    response_type: 'code id_token' // Use authorization code flow with ID token
  },
};

// Use the auth middleware for OIDC authentication
app.use(auth(config));

// Define the home route
app.get('/', (req, res) => {
  const username = req.oidc.user?.username;
  res.send(`
    <h1>Welcome to OIDC App</h1>
    ${req.oidc.isAuthenticated() ? `<p>Hello, ${username}</p>` : '<a href="/login">Login</a>'}
  `);
});

// Define a protected route for user profile information
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
