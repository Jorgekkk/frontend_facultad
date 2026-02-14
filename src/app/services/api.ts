import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/productos/';
  private pagoUrl = 'http://127.0.0.1:8000/api/crear-pago/'; // URL para Mercado Pago

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ESTA ES LA FUNCIÓN QUE TE FALTA:
  crearPreferencia(productoId: number): Observable<any> {
    return this.http.post<any>(this.pagoUrl, { id: productoId });
  }
}
