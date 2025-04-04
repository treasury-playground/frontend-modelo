import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectListingComponent } from './pages/project-listing/project-listing.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' }, // 👈 Página inicial
  
    { path: 'register', component: RegisterComponent }, // 👈 Página standalone fora do layout
  
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'projects', component: ProjectListingComponent },
        { path: 'profile', component: ProfileComponent }
      ]
    }
  ];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
