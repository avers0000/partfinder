import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './auth/auth.service';
import { Params, UrlSegment, Router, NavigationEnd, RouterState, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private routeSubscription;
  displayNav: boolean = true;
  displaySearch: boolean = true;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (firebase.apps.length == 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyD9xe6EIHtD0_EhZrKG6Eq2zEAiguzt3po",
        authDomain: "partfinder-8bf92.firebaseapp.com"
      });
    }
    this.authService.startAuthCheck();

    this.routeSubscription = this.router.events.subscribe((s) => {
      if (s instanceof NavigationEnd) {
        const url = s.urlAfterRedirects;
        let segments = [];
        if (url && url.length > 0) segments = url.split('/');
        if (segments.length > 1 && segments[1] === 'admin') {
          this.displayNav = false
          this.displaySearch = false;
        }
        else {
          this.displayNav = true;
          this.displaySearch = true;
        }
        console.log(this.displayNav);
      }
    });

  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
