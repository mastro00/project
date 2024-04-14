import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


import { AuthComponent } from './auth/auth.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule) }, //con questo carichiamo il path /recipe solo quando viene richiesto e con la arrow function gli passiamo il nome del modulo (importante avere un path vuoto nel recipe-router.module )
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })  //aggiungendo il preloadingStrategy, possiamo caricare in anticipo i componenti che verranno caricati col lazy loading e avere ancora più velocità

  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
