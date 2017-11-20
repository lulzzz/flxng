import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  currentUrl: string = '';
  
  constructor(
    private _router: Router, 
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this._activatedRoute.data.subscribe((data: any) => {
    //   console.log(data);
    // });

    this._router.events.subscribe(event => {
      /* Event classes: NavigationStart, RoutesRecognized, NavigationEnd, NavigationCancel and NavigationError */

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
  });
  }
}
