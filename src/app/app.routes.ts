import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { ListaProductosComponent } from './components/lista-productos/lista-productos';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'lista-productos', component: ListaProductosComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Al abrir, vas al login
];
