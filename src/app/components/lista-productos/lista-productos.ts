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
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { display: block; width: 100%; height: 100%; font-family: 'Poppins', sans-serif; }
    .main-layout { display: flex; flex-direction: row; align-items: flex-start; width: 100%; margin-top: 65px; min-height: calc(100vh - 65px); }

    /* SIDEBAR */
    .sidebar { width: 250px; min-width: 250px; flex-shrink: 0; background: #ffffff; position: sticky; top: 65px; height: calc(100vh - 65px); display: flex; flex-direction: column; padding: 20px 15px; border-right: 1px solid #ddd; overflow-y: auto; z-index: 10; }
    .sidebar h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 15px; color: #2b2e33; }
    .sidebar-links { display: flex; flex-direction: column; gap: 5px; }
    .sidebar-link { padding: 10px 15px; cursor: pointer; color: #555; text-decoration: none; font-size: 0.95rem; border-radius: 8px; transition: all 0.3s ease; }
    .sidebar-link:hover { background-color: rgba(85, 107, 47, 0.05); color: #556b2f; }
    .sidebar-link.active { background-color: rgba(85, 107, 47, 0.1); color: #556b2f; font-weight: 600; border-left: 4px solid #556b2f; }
    .sidebar-sell-card { margin-top: auto; background: #fcfdfa; border: 1px solid rgba(85, 107, 47, 0.2); padding: 20px 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    .btn-vender { width: 100%; padding: 10px; background-color: #556b2f; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; margin-top: 10px; }

    /* PRODUCTOS */
    .products-content { flex-grow: 1; width: calc(100vw - 250px); padding: 25px 30px; }
    .products-content h2 { font-size: 1.6rem; font-weight: 600; margin-bottom: 25px; color: #2b2e33; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .product-card { background: white; border: 1px solid #eef0f2; border-radius: 16px; padding: 15px; display: flex; flex-direction: column; transition: all 0.3s ease; height: 100%; }
    .product-img-container { width: 100%; height: 180px; border-radius: 12px; overflow: hidden; margin-bottom: 12px; background: #f8f9fa; }
    .product-img-container img { width: 100%; height: 100%; object-fit: cover; }
    .buy-btn { margin-top: auto; background: #ffd814; border: 1px solid #fcd200; border-radius: 20px; padding: 10px; width: 100%; cursor: pointer; font-weight: 600; color: #111; transition: all 0.2s; }
    .buy-btn:hover { background: #f7ca00; transform: scale(1.02); }

    @media (max-width: 768px) {
      .main-layout { flex-direction: column; margin-top: 65px; }
      .sidebar { width: 100%; min-width: 100%; height: auto; position: relative; top: 0; border-right: none; border-bottom: 1px solid #ddd; }
      .sidebar h3 { display: none; }
      .sidebar-links { flex-direction: row; overflow-x: auto; white-space: nowrap; }
      .sidebar-sell-card { display: none; }
      .products-content { width: 100%; padding: 15px; }
    }
  `],
  template: `
    <div class="main-layout">
      <aside class="sidebar">
        <h3>Departamentos</h3>
        <div class="sidebar-links">
          <a class="sidebar-link" [class.active]="categoriaActiva === 'TODOS'" (click)="filtrar('TODOS')">Todos</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'ELECTRÓNICOS'" (click)="filtrar('ELECTRÓNICOS')">Electrónicos</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'COMIDA'" (click)="filtrar('COMIDA')">Comida</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'DIVERSIÓN'" (click)="filtrar('DIVERSIÓN')">Diversión</a>
        </div>

        <div class="sidebar-sell-card">
          <small>¿Tienes algo que vender?</small>
          <button routerLink="/publicar" class="btn-vender">Publicar Ahora</button>
        </div>
      </aside>

      <section class="products-content">
        <h2>{{ terminoBusqueda ? 'Resultados de búsqueda: "' + terminoBusqueda + '"' : 'Resultados para ti' }}</h2>

        <div class="products-grid">
          <div *ngIf="productosFiltrados.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #555;">
            No se encontraron productos que coincidan con tu búsqueda.
          </div>

          <div *ngFor="let p of productosFiltrados" class="product-card">
            <div class="product-img-container">
              <img [src]="p.imagen_url || 'assets/img/placeholder.png'" [alt]="p.titulo">
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; margin-bottom: 15px;">
              <h3 style="font-size: 1rem; margin-bottom: 5px; color: #111;">{{ p.titulo }}</h3>
              <div style="font-size: 1.2rem; font-weight: bold; color: #b12704; margin-bottom: 5px;">{{ p.precio | currency }}</div>
              <small style="color: #565959;">Departamento: {{ p.categoria }}</small>
              <small *ngIf="p.vendedor_nombre" style="color: #565959;">Vendido por: {{ p.vendedor_nombre }}</small>
            </div>
            <button class="buy-btn" (click)="agregarAlCarrito(p)">Agregar al carrito</button>
          </div>
        </div>
      </section>
    </div>
  `
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

    // 1. Filtro por Categoría
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
