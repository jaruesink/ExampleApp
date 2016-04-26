import {Component, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {DataService} from '../services/dataservice';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'home-page',
  templateUrl: 'app/home/home.html',
  directives: []
})
export class HomePage {
  messages: Observable<any[]>;
  form_active: boolean = true;
  constructor(public data:DataService, private router: Router) {
    this.data.loadUser();
    this.messages = data.af.list('/messages');
  }
  ngOnInit() {
    if (!this.data.auth_data) {
      this.router.navigate(['Login']);
    }
  }
  send(content){
    var message = {}
    message['author'] = this.data.user.email;
    message['content'] = content;
    this.data.ref.child('messages').push(message);
    this.form_active = false;
    setTimeout(()=> this.form_active=true, 0);
  }
  logout() {
    this.data.auth.logout();
    this.router.navigate(['Login']);
  }
}
