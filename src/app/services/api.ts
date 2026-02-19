import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private productosUrl = 'http://127.0.0.1:8000/api/productos/';
  private pagoUrl = 'http://127.0.0.1:8000/api/crear-pago/'; // URL para Mercado Pago
  private usuariosUrl = 'http://127.0.0.1:8000/api/usuarios';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productosUrl);
  }

  // MERCADO PAGO
  crearPreferencia(productoId: number): Observable<any> {
    return this.http.post<any>(this.pagoUrl, { id: productoId });
  }

  // AUTENTICACIÓN
  registrar(data: any): Observable<any> {
    // Asegúrate de que la URL termine en / si tu Django tiene APPEND_SLASH = True
    return this.http.post(`${this.usuariosUrl}/registro/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.usuariosUrl}/login/`, data);
  }
}
