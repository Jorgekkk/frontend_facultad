import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

declare var MercadoPago: any;

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

   :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: 'Poppins', sans-serif; 
    }

    /* 3. LAYOUT PRINCIPAL */
    .main-layout {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 100%; 
      margin-top: 65px; 
      min-height: calc(100vh - 65px);
    }

    /* SIDEBAR (Escritorio) */
    .sidebar {
      width: 250px;
      min-width: 250px;
      flex-shrink: 0; 
      background: #ffffff;
      position: sticky;
      top: 65px;
      height: calc(100vh - 65px);
      display: flex;
      flex-direction: column;
      padding: 20px 15px;
      border-right: 1px solid #ddd;
      overflow-y: auto;
      z-index: 10;
    }

    .sidebar h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #2b2e33;
    }

    .sidebar-links {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .sidebar-link {
      padding: 10px 15px;
      cursor: pointer;
      color: #555;
      text-decoration: none;
      font-size: 0.95rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 400;
    }

    .sidebar-link:hover { 
      background-color: rgba(85, 107, 47, 0.05); 
      color: #556b2f;
    }

    .sidebar-link.active {
      background-color: rgba(85, 107, 47, 0.1); 
      color: #556b2f;
      font-weight: 600;
      border-left: 4px solid #556b2f; 
    }

    .sidebar-sell-card {
      margin-top: auto;
      background: #fcfdfa; 
      border: 1px solid rgba(85, 107, 47, 0.2); 
      padding: 20px 15px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }

    .btn-vender, .buy-btn {
      width: 100%;
      padding: 10px;
      background-color: #556b2f; 
      color: white;
      border: none;
      border-radius: 10px; 
      cursor: pointer;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .btn-vender:hover, .buy-btn:hover {
      background-color: #435726;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(85, 107, 47, 0.3);
    }

    /* CONTENIDO DE PRODUCTOS */
    .products-content {
      flex-grow: 1;
      width: calc(100vw - 250px); 
      padding: 25px 30px;
    }

    .products-content h2 {
      font-size: 1.6rem;
      font-weight: 600;
      margin-bottom: 25px;
      color: #2b2e33;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }

    .product-card {
      background: white;
      border: 1px solid #eef0f2;
      border-radius: 16px; 
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
      height: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      border-color: rgba(85, 107, 47, 0.3); 
    }

    .buy-btn {
      margin-top: 15px;
      background: #ffd814;
      border: 1px solid #fcd200;
      border-radius: 20px;
      padding: 8px;
      width: 100%;
      cursor: pointer;
      font-weight: 500;
    }

    /* =========================================
       RESPONSIVE (Celulares < 768px)
       ========================================= */
    @media (max-width: 768px) {
      .main-layout {
        flex-direction: column;
        margin-top: 115px; 
        min-height: calc(100vh - 115px);
      }

      .sidebar {
        width: 100vw;
        min-width: 100vw;
        height: auto;
        position: relative; 
        top: 0;
        padding: 10px 15px;
        border-right: none;
        border-bottom: 1px solid #ddd;
      }

      .sidebar h3 { display: none; } 

      .sidebar-links {
        flex-direction: row;
        overflow-x: auto; 
        padding-bottom: 5px;
        gap: 10px;
        scrollbar-width: none; 
      }
      .sidebar-links::-webkit-scrollbar { display: none; }

      .sidebar-link {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 20px;
        white-space: nowrap; 
      }

      .sidebar-link.active {
        border-left: 1px solid #007185;
        border: 1px solid #007185; 
      }

      .sidebar-sell-card { display: none; }

      .products-content {
        width: 100vw;
        padding: 15px;
      }
      
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      }
    }
  `],
  template: `
    <div class="main-layout">
      <aside class="sidebar">
        <h3>Departamentos</h3>
        
        <div class="sidebar-links">
          <a class="sidebar-link" [class.active]="categoriaActiva === 'TODOS'" (click)="filtrar('TODOS')">Todos los departamentos</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'ELECTRONICOS'" (click)="filtrar('ELECTRONICOS')">Electrónicos</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'COMIDA'" (click)="filtrar('COMIDA')">Comida y Bebidas</a>
          <a class="sidebar-link" [class.active]="categoriaActiva === 'DIVERSION'" (click)="filtrar('DIVERSION')">Juegos y Diversión</a>
        </div>

        <div class="sidebar-sell-card">
          <small style="display: block; margin-bottom: 5px; font-weight: bold; color: #111;">¿Tienes algo que vender?</small>
          <button routerLink="/publicar" class="btn-vender">Publicar en VEN FCC</button>
        </div>
      </aside>

      <section class="products-content">
        <h2>Resultados para ti</h2>
        
        <div class="products-grid">
          <div *ngFor="let p of productosFiltrados" class="product-card">
            <div>
              <h3 style="font-size: 1rem; margin-bottom: 8px; color: #;">{{ p.nombre }}</h3>
              <div style="font-size: 1.3rem; font-weight: bold; color: #b12704; margin-bottom: 8px;">{{ p.precio | currency }}</div>
              <small style="color: #565959; display: block; margin-bottom: 5px;">Vendido por: {{ p.vendedor_nombre }}</small>
            </div>
            <button class="buy-btn" (click)="comprar(p)">Comprar ahora</button>
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
  private publicKey = 'APP_USR-03f348b7-b561-4164-8cff-0133a870aa06';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getProductos().subscribe({
      next: (data: any[]) => {
        this.productos = data;
        this.productosFiltrados = data;
      },
      error: (err) => console.error(err)
    });
  }

  filtrar(categoria: string) {
    this.categoriaActiva = categoria;
    if (categoria === 'TODOS') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => p.categoria.toUpperCase() === categoria);
    }
  }

  comprar(producto: any) {
    console.log('Comprando', producto);
    this.api.crearPreferencia(producto.id).subscribe({
      next: (res) => {
        if (res.id) {
          const mp = new MercadoPago(this.publicKey, { locale: 'es-MX' });
          mp.checkout({ preference: { id: res.id }, autoOpen: true });
        }
      },
      error: (err) => alert('Error al iniciar pago')
    });
  }
}