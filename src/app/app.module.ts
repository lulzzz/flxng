import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { ShowcaseTreetableModule } from './showcase-treetable/showcase-treetable.module';
import { ShowcaseCircleTimerModule } from './showcase-circle-timer/showcase-circle-timer.module';
import { ShowcaseLoaderModule } from './showcase-loader/showcase-loader.module';
import { ShowcasePaginatorModule } from './showcase-paginator/showcase-paginator.module';
import { ShowcaseMentionsModule } from './showcase-mentions/showcase-mentions.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { routes } from './app-routes.const';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    SharedModule,
    ShowcaseModule,
    ShowcaseTreetableModule,
    ShowcaseCircleTimerModule,
    ShowcaseLoaderModule,
    ShowcasePaginatorModule,
    ShowcaseMentionsModule,
  ],
  declarations: [AppComponent, NavigationComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
