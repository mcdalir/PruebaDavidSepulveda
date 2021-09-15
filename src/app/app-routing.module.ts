import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CRUDComponent } from './crud/crud.component';
import { FrontEndComponent } from './front-end/front-end.component';


const routes: Routes = [
  {
    path: '',
    component: FrontEndComponent
  },
  {
    path: 'crud',
    component: CRUDComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
