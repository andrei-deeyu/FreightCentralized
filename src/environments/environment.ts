export const environment = {
  production: false,
  domainName: 'http://localhost:4200/',
  API_URL: 'http://localhost:5000/api/v1',
  PUBLIC_API_URL: 'http://localhost:5000/api/v0',
  WS_URL: 'ws://localhost:3000',
  auth0: {
    domain: 'dev-deeyu.eu.auth0.com',
    clientId: 'pKJwzY5aItCFtHlsCRBkgzg0suY2AaLI',
    authorizationParams: {
      audience: 'https://dev-deeyu.eu.auth0.com/api/v2/',
      redirect_uri: window.location.origin,
    },
  },
  idtoken_namespace: 'https://github.com/andrei-deeyu--user.values-app_metadata'
}