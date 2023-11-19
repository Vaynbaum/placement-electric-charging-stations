import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapPageComponent } from './map-page/map-page.component';
import { ModelPageComponent } from './model-page/model-page.component';
import { AboutUsPageComponent } from './about-us-page/about-us-page.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'map',
  pathMatch: 'full',
},
{ path: 'map', component: MapPageComponent },
{ path: 'model', component: ModelPageComponent },
{ path: 'about-us', component: AboutUsPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
