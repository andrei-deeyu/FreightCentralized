import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './core/components/not-found/not-found.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '**', component: NotFoundComponent }
    ]),
  ]
})
export class WildCardRouteModule { }
