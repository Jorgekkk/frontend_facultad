import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URLs actualizadas apuntando a tu servidor de Railway en producción
  private productosUrl = 'https://backendfacultad-production.up.railway.app/api/productos/';
  private pagoUrl = 'https://backendfacultad-production.up.railway.app/api/crear-pago/';
  private usuariosUrl = 'https://backendfacultad-production.up.railway.app/api/usuarios';
  private chatUrl = 'https://web-production-257e2.up.railway.app/api/chat';
  private resenasUrl = 'https://microservice-revews.vercel.app/api/resenas';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productosUrl);
  }

  // MERCADO PAGO
  crearPreferencia(producto: any) {
  // Enviamos el objeto producto completo que contiene titulo y precio
  return this.http.post<any>(`${this.pagoUrl}`, producto);
}

pagarCarrito(productos: any[]) {
  // Lo enviamos envuelto en un objeto con la propiedad "carrito"
  return this.http.post<any>(`${this.pagoUrl}`, { carrito: productos });
}
  // AUTENTICACIÓN
  registrar(data: any): Observable<any> {
    // Asegúrate de que la URL termine en / si tu Django tiene APPEND_SLASH = True
    return this.http.post(`${this.usuariosUrl}/registro/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/login/`, data);
  }

  enviarMensajeChat(texto: string): Observable<any> {
  return this.http.post<any>(this.chatUrl, { texto: texto });
}

// Función para TRAER las reseñas de un producto
  getResenas(productoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.resenasUrl}/${productoId}`);
  }

  // Función para GUARDAR una reseña nueva
  crearResena(datosResena: any): Observable<any> {
    return this.http.post<any>(this.resenasUrl, datosResena);
  }
}
