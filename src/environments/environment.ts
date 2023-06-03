export const environment = {
  production: false,
  API_URL: 'http://localhost:5000/api/v1',
  WS_URL: 'ws://localhost:3000',
  auth0: {
    domain: 'dev-deeyu.eu.auth0.com',
    clientId: 'pKJwzY5aItCFtHlsCRBkgzg0suY2AaLI',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  }
}