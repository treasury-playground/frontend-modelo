import { Routes } from '@angular/router';
import { RegisterComponent }        from './components/register/register.component';
import { MainLayoutComponent }      from './components/main-layout/main-layout.component';
import { TeacherMenuComponent }     from './components/teacher-menu/teacher-menu.component';
import { TeacherListingComponent }  from './components/teacher-listing/teacher-listing.component';
import { StudentMenuComponent }     from './components/student-menu/student-menu.component';
import { StudentListingComponent }  from './components/student-listing/student-listing.component';

export const routes: Routes = [
  { path: '', component: RegisterComponent },

  {
    path: 'teacher',
    component: MainLayoutComponent,
    children: [
      { path: 'menu',    component: TeacherMenuComponent },     // /teacher/menu
      { path: 'listing', component: TeacherListingComponent }   // /teacher/listing
    ]
  },

  {
    path: 'student',
    component: MainLayoutComponent,
    children: [
      { path: 'menu',    component: StudentMenuComponent },     // /student/menu
      { path: 'listing', component: StudentListingComponent }   // /student/listing
    ]
  },

  // Fallback para rotas desconhecidas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
