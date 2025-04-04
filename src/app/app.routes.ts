import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { ListingComponent } from './components/listing/listing.component';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'listing',
        component: ListingComponent
    }
];
