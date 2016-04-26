import { HTTP_PROVIDERS } from 'angular2/http'
import { bootstrap } from 'angular2/platform/browser'
import { ROUTER_PROVIDERS } from 'angular2/router'
import { FIREBASE_PROVIDERS, defaultFirebase, AngularFire, firebaseAuthConfig, AuthMethods, AuthProviders } from 'angularfire2'
import { ChatApp } from './app/chatapp'
import { DataService } from './app/services/dataservice'

bootstrap(ChatApp, [
  FIREBASE_PROVIDERS,
  defaultFirebase('https://brilliant-fire-1820.firebaseio.com'),
  firebaseAuthConfig({
    method: AuthMethods.Password,
    provider: AuthProviders.Password
  }),
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  DataService
]);
