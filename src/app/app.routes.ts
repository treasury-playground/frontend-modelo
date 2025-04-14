import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { ListingComponent } from './components/listing/listing.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: RegisterComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'menu',
                component: MenuComponent
            },
            {
                path: 'menu/listing',
                component: ListingComponent
            }
        ]
    }
];
