import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito';
// 1. IMPORTANTE: Agregamos el import de tu API que faltaba
import { ApiService } from '../../services/api';

declare var MercadoPago: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.scss']
})
export class CarritoComponent implements OnInit {
  productosCarrito: any[] = [];
  totalPagar: number = 0;
  private publicKey = 'APP_USR-03f348b7-b561-4164-8cff-0133a870aa06';

  constructor(
    private carritoService: CarritoService,
    private api: ApiService // Aquí está perfecto
  ) {}

  ngOnInit() {
    // Nos suscribimos para ver qué hay en el carrito
    this.carritoService.carrito$.subscribe(items => {
      this.productosCarrito = items;
      this.totalPagar = this.carritoService.obtenerTotal();
    });
  }

  quitarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
  }

  procederAlPago() {
    if (this.productosCarrito.length === 0) return;

    console.log('🛒 Enviando carrito completo a MP...');

    this.api.pagarCarrito(this.productosCarrito).subscribe({
      next: (res: { id: any; }) => {
        if (res.id) {
          const mp = new MercadoPago(this.publicKey, { locale: 'es-MX' });
          mp.checkout({ preference: { id: res.id }, autoOpen: true });
        }
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al iniciar el pago. Revisa la consola.');
      }
    });
  }
}
