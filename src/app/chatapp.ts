import {Component, Inject} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {LoginPage} from './login/login';
import {HomePage} from './home/home';

@Component({
  selector: 'chat-app',
  providers: [ROUTER_PROVIDERS],
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  {path:'/login', name: 'Login', component: LoginPage},
  {path:'/',  name: 'Home',  component: HomePage, useAsDefault: true}
])
export class ChatApp {
  constructor() {
  }
}
