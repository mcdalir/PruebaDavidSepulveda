import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CRUDComponent } from './crud/crud.component';
import { FrontEndComponent } from './front-end/front-end.component';

@NgModule({
  declarations: [
    AppComponent,
    FrontEndComponent,
    CRUDComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFireAnalyticsModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
