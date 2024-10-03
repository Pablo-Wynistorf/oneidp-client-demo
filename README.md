# OIDC Demo Applications

## Overview

These are some demo applications demonstrating how to implement OpenID Connect (OIDC) authentication using different libraries in an Express.js environment. They serve as reference implementations for integrating OIDC with your applications and showcase how user authentication can be handled through a provider like OneIDP.

### Applications

1. **OIDC App with `express-openid-connect`**:
   - A straightforward implementation of OIDC using the `express-openid-connect` middleware. This application demonstrates how to authenticate users and manage their sessions easily.

2. **OIDC App with `passport` and `openid-client`**:
   - A more customizable implementation using `passport` and `openid-client`. This application provides a deeper dive into OIDC by allowing the user to manage authentication flows, including session management and user serialization.

## Prerequisites

Before running these applications, ensure you have the following:

- **Node.js**: Install [Node.js](https://nodejs.org/) (version 14 or later).
- **Environment Variables**: Rename the .env.example file to .env and add the missing data.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pablo-Wynistorf/oneidp-client-demo.git
   cd src/node-librarys
   ```

2. Navigate to each application directory and install the dependencies:

   For the `express-openid-connect` app:

   ```bash
   cd express-openid-connect
   npm install
   ```

   For the `passport` and `openid-client` app:

   ```bash
   cd openid-client-and-passport
   npm install
   ```

## Running the Applications

1. Start the `express-openid-connect` app:

   ```bash
   cd express-openid-connect
   node express.js
   ```

   The application will run on `http://localhost:3000` by default.

2. Start the `passport` and `openid-client` app:

   ```bash
   cd openid-client-and-passport
   node express.js
   ```

   This application will also run on `http://localhost:3000`, so make sure to adjust the port if necessary.

## Usage

- **Home Route**: Both applications provide a simple home route (`/`) with a login link.
- **Login**: Clicking the login link will redirect the user to the OIDC provider for authentication.
- **Profile Route**: Once authenticated, users will be redirected to the `/profile` route, displaying their username or profile information.

## Conclusion

These demo applications provide a solid foundation for understanding OIDC implementation in Express.js. You can modify and extend these applications to suit your specific use cases or integrate them into larger projects. 

## License

This project is licensed under the MIT License.
