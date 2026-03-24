import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router'; 
import { ApiService } from '../../services/api';
import { SupabaseService } from '../../services/supabase';

declare var MercadoPago: any;

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss' 
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaActiva: string = 'TODOS';
  terminoBusqueda: string = ''; 
  private publicKey = 'APP_USR-03f348b7-b561-4164-8cff-0133a870aa06';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute, 
    private supabase: SupabaseService 
  ) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.obtenerProductos();
    if (data) {
      this.productos = data;
      
      this.route.queryParams.subscribe(params => {
        this.terminoBusqueda = params['q'] || '';
        this.aplicarFiltros(); 
      });
    }
  }

  filtrar(categoria: string) {
    this.categoriaActiva = categoria;
    this.aplicarFiltros(); 
  }

  aplicarFiltros() {
    let resultados = this.productos;

    if (this.categoriaActiva !== 'TODOS') {
      const catBuscada = this.categoriaActiva.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
      
      resultados = resultados.filter(p => {
        if (!p.categoria) return false;
        const catProducto = p.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
        return catProducto === catBuscada;
      });
    }

    if (this.terminoBusqueda) {
      const busqueda = this.terminoBusqueda.toLowerCase().trim();
      
      resultados = resultados.filter(p => 
        (p.titulo && p.titulo.toLowerCase().includes(busqueda)) || 
        (p.vendedor_nombre && p.vendedor_nombre.toLowerCase().includes(busqueda))
      );
    }

    this.productosFiltrados = resultados;
  }

  comprar(producto: any) {
    console.log('🛒 Producto enviado al backend:', producto);

    if (!producto.titulo || !producto.precio) {
      alert('Error: El producto no tiene título o precio válido.');
      return;
    }

    this.api.crearPreferencia(producto).subscribe({
      next: (res) => {
        if (res.id) {
          const mp = new MercadoPago(this.publicKey, { locale: 'es-MX' });
          mp.checkout({ preference: { id: res.id }, autoOpen: true });
        }
      },
      error: (err) => {
        console.error('❌ Error en el backend:', err);
        alert('Error al procesar el pago. Revisa la consola del servidor.');
      }
    });
  }
}