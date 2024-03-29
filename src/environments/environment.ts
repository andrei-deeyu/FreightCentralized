export const environment = {
  production: false,
  domainName: 'localhost:4200',
  domainLink: 'http://www.freightcentralized.com/',
  brandName: 'FreightCentralized',
  brandDesc: 'All-in-One Freight Exchange Solution - Connecting Shippers, Carriers, Freight Forwarders, and Logistics Companies for Effortless Supply Chain Optimization!',
  githubRepo: 'https://github.com/andrei-deeyu/simple-angular-app',
  contactEmail: 'thedeeyu@gmail.com',
  API_URL: 'http://localhost:5000/api/v1',
  API_AUTH_URL: 'http://localhost:5000/auth',
  PUBLIC_API_URL: 'http://localhost:5000/api/v0',
  WS_URL: 'ws://localhost:5000/ws',
  auth0: {
    domain: 'dev-deeyu.eu.auth0.com',
    clientId: 'pKJwzY5aItCFtHlsCRBkgzg0suY2AaLI',
    authorizationParams: {
      audience: 'https://dev-deeyu.eu.auth0.com/api/v2/',
      redirect_uri: window.location.origin,
    },
  },
  idtoken_namespace: 'https://github.com/andrei-deeyu--user.values-',
  google_maps_api_key: 'AIzaSyAMiDlVQV-889wyPzJ8ff1idtoC5t3OFMU'
}