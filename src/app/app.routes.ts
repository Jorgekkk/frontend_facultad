import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Al abrir, vas al login
];