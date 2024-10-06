import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { UserListComponent } from './features/users/user-list/user-list.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'user',
        children: [
            {
                path: '',
                component: UserListComponent
            },
            {
                path: 'new',
                component: UserFormComponent
            },
            {
                path: ':id',
                component: UserFormComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
