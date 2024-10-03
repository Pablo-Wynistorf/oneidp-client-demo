const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');
require('dotenv').config();
const app = express();

// Configuration for server and OIDC details
const PORT = process.env.PORT || 3000; // Set the port for the server
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET; // Secret for session management
const OIDC_BASE_URL = process.env.OIDC_BASE_URL; // OIDC issuer base URL
const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID; // OIDC client ID
const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET; // OIDC client secret

const REDIRECT_URI = 'http://localhost:3000/callback'; // URI to redirect to after authentication

// Configure session middleware for managing user sessions
app.use(session({ secret: EXPRESS_SESSION_SECRET, resave: false, saveUninitialized: true }));

// Initialize Passport.js for user authentication
app.use(passport.initialize());
app.use(passport.session());

// Set up the OIDC issuer and strategy
async function setupOIDC() {
    const oidcIssuer = await Issuer.discover(OIDC_BASE_URL); // Discover OIDC provider configuration
    const client = new oidcIssuer.Client({
        client_id: OIDC_CLIENT_ID, // OIDC client ID
        client_secret: OIDC_CLIENT_SECRET, // OIDC client secret
        redirect_uris: [REDIRECT_URI], // Allowed redirect URIs
        response_types: ['code'], // Response type for authorization code flow
    });

    // Configure Passport.js with the OIDC strategy
    passport.use('oidc', new Strategy({ client }, (tokenset, userInfo, done) => {
        if (!userInfo) {
            return done(new Error('User not found'), null); // Handle case where user info is not found
        }
        
        return done(null, userInfo); // Successful authentication, return user info
    }));

    // Serialize user into session
    passport.serializeUser((user, done) => {
        done(null, user); // Save user information in the session
    });

    // Deserialize user from session
    passport.deserializeUser((user, done) => {
        done(null, user); // Retrieve user information from the session
    });
}

// Start the OIDC setup
setupOIDC().then(() => {
    // Define routes
    app.get('/login', (req, res, next) => {
        passport.authenticate('oidc')(req, res, next); // Initiate the authentication process
    });

    app.get('/callback', 
        (req, res, next) => {
            next(); // Proceed to the next middleware
        },
        (req, res, next) => {
            passport.authenticate('oidc', (err, user, info) => {
                if (err) {
                    return res.redirect('/'); // Redirect on error
                }
                if (!user) {
                    return res.redirect('/'); // Redirect if no user found
                }
                req.logIn(user, (loginErr) => {
                    if (loginErr) {
                        console.error('Login error:', loginErr);
                        return res.redirect('/'); // Redirect on login error
                    }
                    return res.redirect('/profile'); // Redirect to profile page on successful login
                });
            })(req, res, next);
        }
    );

    // Protected route to display user profile
    app.get('/profile', (req, res) => {
        if (req.isAuthenticated()) {
            res.send(`<h1>Hello, ${req.user.username}</h1>`); // Display the authenticated user's username
        } else {
            res.redirect('/'); // Redirect to home if user is not authenticated
        }
    });

    // Home route with login link
    app.get('/', (req, res) => {
        res.send('<a href="/login">Login with OIDC</a>'); // Provide a link to initiate login
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL to the console
    });
}).catch(err => {
    console.error('OIDC setup failed:', err); // Log error if OIDC setup fails
});
