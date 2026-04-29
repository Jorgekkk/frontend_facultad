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

  constructor() {
    // NUEVO: Al iniciar el servicio, cargamos lo que haya en el navegador
    this.cargarDeLocalStorage();
  }

  agregarProducto(producto: any) {
    this.productos.push(producto);
    this.carritoSubject.next(this.productos); // Tocamos la campana

    // NUEVO: Guardamos la lista actualizada
    this.guardarEnLocalStorage();

    console.log('🛒 Producto agregado:', producto.titulo);
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    this.carritoSubject.next(this.productos); // Tocamos la campana

    // NUEVO: Guardamos el cambio
    this.guardarEnLocalStorage();
  }

  obtenerTotal() {
    return this.productos.reduce((total, prod) => total + parseFloat(prod.precio), 0);
  }

  vaciarCarrito() {
    this.productos = [];
    this.carritoSubject.next(this.productos);

    // NUEVO: Limpiamos el almacenamiento
    this.guardarEnLocalStorage();
  }

  // --- FUNCIONES NUEVAS PARA LA MEMORIA ---

  private guardarEnLocalStorage() {
    // Guardamos el arreglo 'productos' convertido a texto
    localStorage.setItem('carrito_venfcc', JSON.stringify(this.productos));
  }

  private cargarDeLocalStorage() {
    const datos = localStorage.getItem('carrito_venfcc');
    if (datos) {
      // Si hay datos, los metemos a nuestro arreglo y avisamos por el megáfono
      this.productos = JSON.parse(datos);
      this.carritoSubject.next(this.productos);
    }
  }
}
