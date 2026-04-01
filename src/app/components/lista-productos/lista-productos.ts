import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { SupabaseService } from '../../services/supabase';
import { ResenasModalComponent } from '../resenas-modal/resenas-modal';
import { CarritoService } from '../../services/carrito';

declare var MercadoPago: any;

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, ResenasModalComponent],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.scss'
})
export class ListaProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaActiva: string = 'TODOS';
  terminoBusqueda: string = '';

  // Variable para controlar qué producto se abre en el modal
  productoSeleccionadoParaResenas: any = null;

  private publicKey = 'APP_USR-03f348b7-b561-4164-8cff-0133a870aa06';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private carritoService: CarritoService
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

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    alert(`¡${producto.titulo} agregado al carrito! 🛒`);
  }

  // --- NUEVAS FUNCIONES PARA EL MODAL DE RESEÑAS ---

  abrirResenas(producto: any) {
    this.productoSeleccionadoParaResenas = producto;
  }

  cerrarResenas() {
    this.productoSeleccionadoParaResenas = null;
  }
}
