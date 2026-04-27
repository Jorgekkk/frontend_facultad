import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private productosUrl = 'https://backendfacultad-production.up.railway.app/api/productos/';
  private pagoUrl = 'https://backendfacultad-production.up.railway.app/api/crear-pago/';
  private usuariosUrl = 'https://backendfacultad-production.up.railway.app/api/usuarios';
  private chatUrl = 'https://web-production-257e2.up.railway.app/api/chat';
  private resenasUrl = 'https://microservice-revews.vercel.app/api/resenas';
  private favoritosUrl = 'https://microservicio-favoritos.vercel.app/api/favoritos';
  
  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productosUrl);
  }

  getUsuarioActualId(): string {
    const userId = localStorage.getItem('user_id');
    return userId ? userId : 'invitado';
  }

  // MERCADO PAGO
  crearPreferencia(producto: any) {
    return this.http.post<any>(`${this.pagoUrl}`, producto);
  }

  pagarCarrito(productos: any[]) {
    return this.http.post<any>(`${this.pagoUrl}`, { carrito: productos });
  }

  // AUTENTICACIÓN
  registrar(data: any): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/registro/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/login/`, data);
  }

  enviarMensajeChat(texto: string): Observable<any> {
    return this.http.post<any>(this.chatUrl, { texto: texto });
  }

  // RESEÑAS
  getResenas(productoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.resenasUrl}/${productoId}`);
  }

  crearResena(datosResena: any): Observable<any> {
    return this.http.post<any>(this.resenasUrl, datosResena);
  }

  // FAVORITOS
  getFavoritos(): Observable<any> {
    const id = this.getUsuarioActualId();
    return this.http.get<any>(`${this.favoritosUrl}/${id}`);
  }

  toggleFavorito(productoId: string): Observable<any> {
    const id = this.getUsuarioActualId();
    return this.http.post<any>(`${this.favoritosUrl}/toggle`, {
      usuarioId: id,
      productoId: productoId
    });
  }
}