import {Component, Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {AngularFire, FirebaseRef, FirebaseAuth} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  user_data: Observable<any>;
  auth_data: any;
  user: any;
  constructor(@Inject(FirebaseAuth) public auth, @Inject(FirebaseRef) public ref, public af:AngularFire, public http:Http){}
  loadUser() {
    this.auth.subscribe( auth_data => {
      this.auth_data = auth_data;
      if(auth_data) {
        this.user_data = this.af.object('/users/'+auth_data.uid).map( (user) => {
            user.onesignal_ids = this.af.list('/onesignal_ids/'+auth_data.uid);
            user.onesignal_ids.subscribe( onesignal_ids => {
              this.user.onesignal_ids = onesignal_ids;
            });
            return user;
            
        });
        this.user_data.subscribe( user_data => {
          this.user = user_data;
          console.log('User data loaded.', this.user);
        });
      }
    });
  }
  post(url: string, data: Object, doNext?:any, onFail?:any) {
      var header = new Headers();
      header.append('Content-Type', 'application/json');
      var response = new Promise((resolve:any, reject:any) =>  {
          this.http.post(url, JSON.stringify(data), {
              headers: header
          })
          .map(response => response.json())
          .subscribe(
              data => resolve(data),
              err => reject(err),
              () => console.log('Login Request Complete')
          );
      });
      response.then(success => {
          if (doNext) {
            doNext(success);
          }
      }, error => {
          if (onFail) {
            onFail(error);
          }
      });
  }
  sendNotification() {
    return;
  }
}
