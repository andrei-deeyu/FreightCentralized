# Run Locally

#### 1. [get a token](https://jwt.io/) that includes `"admin": true` in the payload.
#### 2. go to `src/app/mock-backend.ts`
```javascript
export class MockBackendInterceptor implements HttpInterceptor {
  private theToken:string = 'INSERT TOKEN';
```
