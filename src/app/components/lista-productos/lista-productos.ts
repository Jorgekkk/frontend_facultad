import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { SupabaseService } from '../../services/supabase';
// IMPORTANTE: Importamos tu nuevo servicio del carrito
import { CarritoService } from '../../services/carrito';

declare var MercadoPago: any;

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  // Nos quedamos con tu versión limpia: archivos separados
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
    private supabase: SupabaseService,
    private carritoService: CarritoService // Inyectamos el servicio
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

  // IMPORTANTE: Esta es la nueva función que guarda el producto en memoria
  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    alert(`¡${producto.titulo} agregado al carrito! 🛒`);
  }
}