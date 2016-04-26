import {Component, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {DataService} from '../services/dataservice';

@Component({
  selector: 'login-page',
  providers: [],
  templateUrl: 'app/login/login.html',
  directives: [],
  pipes: []
})
export class LoginPage {
  auth_data:          any;
  onesignal_id:       string;
  facebook_pending:   boolean = false;
  google_pending:     boolean = false;
  incorrect_password: boolean = false;
  password_pending:   boolean = false;
  error_logging_in:   boolean = false;
  constructor(public data:DataService, private router:Router) {
    if (window.deviceready) {
      window.plugins.OneSignal.getIds((ids) => {
        this.onesignal_id = ids.userId;
      });
    }
  }
  facebookLogin() {
    this.facebook_pending = true;
    this.data.ref.authWithOAuthPopup("facebook", (error, authData) => {
      if (error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          this.data.ref.authWithOAuthRedirect("facebook", (error, authData) => {
            if (error) {
              console.log("Login Failed!", error);
              this.error_logging_in = true;
              this.facebook_pending = false;
            } else {
              console.log("Authenticated successfully with payload:", authData);
              this.data.ref.child("users").child(authData.uid).set({
                email: authData.facebook.email,
                name: authData.facebook.displayName,
                profile_img: authData.facebook.profileImageURL
              });
              if (window.deviceready) {
                this.data.ref.child("users").child('onesignal_ids').child(authData.uid).push(this.onesignal_id);
              }
              this.resetErrors();
              this.router.navigate(['Home']);
            }
          }, {
            scope: "email"
          });
        } else {
          console.log("Login Failed!", error);
          this.error_logging_in = true;
          this.facebook_pending = false;
        }
      } else {
        console.log("Authenticated successfully with payload:", authData);
        this.data.ref.child("users").child(authData.uid).set({
          email: authData.facebook.email,
          name: authData.facebook.displayName,
          profile_img: authData.facebook.profileImageURL
        });
        if (window.deviceready) {
          this.data.ref.child('onesignal_ids').child(authData.uid).push(this.onesignal_id);
        }
        this.resetErrors();
        this.router.navigate(['Home']);
      }
    }, {
      scope: "email"
    });
  }
  googleLogin() {
    this.google_pending = true;
    this.data.ref.authWithOAuthPopup("google", (error, authData) => {
      if (error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          this.data.ref.authWithOAuthRedirect("google", (error, authData) => {
            if (error) {
              console.log("Login Failed!", error);
              this.error_logging_in       = true;
              this.facebook_pending = false;
            } else {
              console.log("Authenticated successfully with payload:", authData);
              this.data.ref.child("users").child(authData.uid).set({
                email: authData.google.email,
                name: authData.google.displayName,
                profile_img: authData.google.profileImageURL
              });
              if (window.deviceready) {
                this.data.ref.child('onesignal_ids').child(authData.uid).push(this.onesignal_id);
              }
              this.resetErrors();
              this.router.navigate(['Home']);
            }
          }, {
            scope: "email"
          });
        } else {
          console.log("Login Failed!", error);
          this.error_logging_in       = true;
          this.google_pending = false;  
        }
      } else {
        console.log("Authenticated successfully with payload:", authData);
        this.data.ref.child("users").child(authData.uid).set({
          email: authData.google.email,
          name: authData.google.displayName,
          profile_img: authData.google.profileImageURL
        });
        if (window.deviceready) {
          this.data.ref.child('onesignal_ids').child(authData.uid).push(this.onesignal_id);
        }
        this.resetErrors();
        this.router.navigate(['Home']);
      }
    }, {
      scope: "email"
    });
  }
  passwordLogin(email, password) {
    this.password_pending = true;
    this.data.ref.authWithPassword({
      email    : email,
      password : password
    }, (error, authData) => {
      if (error) {
        console.log("Login Failed!", error);
        if (error.code === "INVALID_PASSWORD") {
          this.incorrect_password = true;
          this.password_pending = false;
        } else {
          this.createAccount(email, password);
        }
      } else {
        if (window.deviceready) {
          this.data.ref.child('onesignal_ids').child(authData.uid).push(this.onesignal_id);
        }
        this.resetErrors();
        this.router.navigate(['Home']);
      }
    });
  }
  createAccount(email, password) {
    this.data.ref.createUser({
      email    : email,
      password : password
    }, (error, authData) => {
      if (error) {
        console.log("Error creating user:", error);
        this.error_logging_in = true;
        this.password_pending = false;
      } else {
        this.data.ref.child("users").child(authData.uid).set({
          email: email
        });
        this.passwordLogin(email, password);
      }
    });
  }
  resetErrors() {
    this.error_logging_in   = false;
    this.incorrect_password = false;
    this.facebook_pending   = false;
    this.google_pending     = false;
    this.password_pending   = false;
  }
}
