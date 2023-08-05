export const environment = {
  production: false,
  domainName: '',
  domainLink: 'INSERT_CLIENT_URL',
  brandName: '',
  brandDesc: '',
  githubRepo: '',
  contactEmail: '',
  API_URL: 'https://INSERT_BACKEND_URL/api/v1',
  API_AUTH_URL: 'https://INSERT_BACKEND_URL/auth',
  PUBLIC_API_URL: 'https://INSERT_BACKEND_URL/api/v0',
  WS_URL: 'wss://INSERT_BACKEND_URL/ws',
  auth0: {
    domain: 'dev-INSERT_AUTH0_USERNAME.eu.auth0.com',
    clientId: '',
    authorizationParams: {
      audience: 'https://dev-INSERT_AUTH0_USERNAME.eu.auth0.com/api/v2/',
      redirect_uri: window.location.origin,
    },
  },
  idtoken_namespace: 'INSERT_NAMESPACE--user.values-',
  google_maps_api_key: ''
}