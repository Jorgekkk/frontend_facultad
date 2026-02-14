import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

// Declaramos la variable de Mercado Pago para que TypeScript no de error
declare var MercadoPago: any;

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 style="text-align: center; font-family: sans-serif;">Productos de la Facultad</h2>

    <div style="display: flex; flex-wrap: wrap; justify-content: center;">
      <div *ngFor="let p of productos" style="border: 1px solid #ddd; border-radius: 8px; margin: 10px; padding: 15px; width: 250px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">{{ p.nombre }}</h3>
        <p style="font-size: 1.2em; color: #2e7d32; font-weight: bold;">{{ p.precio | currency }}</p>
        <p><strong>Categoría:</strong> {{ p.categoria }}</p>
        <p><small>Vendido por: {{ p.vendedor_nombre }}</small></p>

        <button
          (click)="comprar(p)"
          style="background-color: #009ee3; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Comprar ahora
        </button>
      </div>
    </div>
  `
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];

  // ✅ Tu Public Key de prueba (correcto)
  private publicKey = 'APP_USR-03f348b7-b561-4164-8cff-0133a870aa06';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Cargar productos al iniciar el componente
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data;
        console.log('✅ Productos cargados correctamente:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err);
        alert('Error al cargar los productos. Verifica que el servidor Django esté corriendo.');
      }
    });
  }

  comprar(producto: any): void {
    console.log('🛒 Iniciando proceso de compra...');
    console.log('📦 Producto seleccionado:', producto);
    console.log('🆔 ID del producto:', producto.id);

    // 1. Llamar al backend de Django para crear la preferencia
    this.api.crearPreferencia(producto.id).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del backend:', res);
        console.log('🎫 Preference ID recibido:', res.id);

        // Verificar que recibimos el ID
        if (!res.id) {
          console.error('❌ No se recibió el preference ID');
          alert('Error: No se recibió el ID de preferencia de pago');
          return;
        }

        try {
          // 2. Inicializar Mercado Pago con la Public Key
          console.log('🔧 Inicializando Mercado Pago...');
          const mp = new MercadoPago(this.publicKey, {
            locale: 'es-MX'
          });

          // 3. Abrir el checkout de Mercado Pago
          console.log('🚀 Abriendo checkout...');
          mp.checkout({
            preference: {
              id: res.id
            },
            autoOpen: true
          });

          console.log('✅ Checkout abierto exitosamente');

        } catch (mpError) {
          console.error('❌ Error al inicializar Mercado Pago:', mpError);
          alert('Error al abrir el checkout de Mercado Pago. Verifica que el SDK esté cargado.');
        }
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        console.error('📊 Estado HTTP:', err.status);
        console.error('📄 Cuerpo del error:', err.error);

        // Mensaje de error más específico
        let mensaje = 'Error al procesar el pago.';

        if (err.status === 400) {
          mensaje = err.error?.error || 'Solicitud inválida. Verifica los datos del producto.';
        } else if (err.status === 404) {
          mensaje = 'Producto no encontrado en el servidor.';
        } else if (err.status === 500) {
          mensaje = 'Error interno del servidor. Revisa los logs de Django.';
        } else if (err.status === 0) {
          mensaje = 'No se puede conectar con el servidor. ¿Está Django corriendo en http://127.0.0.1:8000?';
        }

        alert(mensaje);
      }
    });
  }

  private redirigirAPago(respuesta: any): void {
    console.log('🌐 Preparando redirección a Mercado Pago...');

    // Prioridad:
    // 1. sandbox_init_point (para pruebas)
    // 2. init_point (para producción)
    const urlPago = respuesta.sandbox_init_point || respuesta.init_point;

    if (urlPago) {
      console.log('✅ URL de pago obtenida:', urlPago);
      console.log('🚀 Redirigiendo al checkout de Mercado Pago...');

      // Redirigir a la página de pago
      window.location.href = urlPago;
    } else {
      console.error('❌ No se recibió ninguna URL de pago');
      console.error('Respuesta completa:', respuesta);
      alert('Error: No se pudo obtener la URL de pago de Mercado Pago');
    }
  }
}

