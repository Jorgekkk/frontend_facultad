import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { ListaProductosComponent } from './components/lista-productos/lista-productos';
import { PublicarComponent } from './components/publicar/publicar';
import { ExitoComponent } from './components/exito/exito';
import { ErrorComponent } from './components/error/error';
import { CarritoComponent } from './components/carrito/carrito';
import { PerfilComponent } from './components/perfil/perfil';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'lista-productos', component: ListaProductosComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'publicar', component: PublicarComponent },
  { path: 'exito', component: ExitoComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'perfil', component: PerfilComponent },
];
