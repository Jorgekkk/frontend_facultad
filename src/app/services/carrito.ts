import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Aquí guardamos los productos en secreto
  private productos: any[] = [];

  // El "megáfono" que avisa a los demás componentes
  private carritoSubject = new BehaviorSubject<any[]>([]);

  // Lo que los componentes pueden escuchar
  carrito$ = this.carritoSubject.asObservable();

  constructor() { }

  agregarProducto(producto: any) {
    this.productos.push(producto);
    this.carritoSubject.next(this.productos); // Tocamos la campana
    console.log('🛒 Producto agregado:', producto.titulo);
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    this.carritoSubject.next(this.productos); // Tocamos la campana
  }

  obtenerTotal() {
    return this.productos.reduce((total, prod) => total + parseFloat(prod.precio), 0);
  }

  vaciarCarrito() {
    this.productos = [];
    this.carritoSubject.next(this.productos);
  }
}
