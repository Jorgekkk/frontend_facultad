import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  nombreUsuario: string = '';
  avatarUrl: string | null = null;

  // 2. Creamos la variable que guardará el número del carrito
  cantidadCarrito: number = 0;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private carritoService: CarritoService // 3. Inyectamos el servicio
  ) {}

  async ngOnInit() {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      const { data, error } = await this.supabase.getPerfil(userId);
      if (data) {
        this.nombreUsuario = data.nombre_completo;
        this.avatarUrl = data.avatar_url;
      }
    }

    // --- LÓGICA DEL CARRITO ---
    this.carritoService.carrito$.subscribe(productos => {
      this.cantidadCarrito = productos.length;
    });
  }

  buscar(termino: string) {
    if (termino.trim()) {
      this.router.navigate(['/lista-productos'], {
        queryParams: { q: termino.trim() },
        replaceUrl: true
      });
    } else {
       this.router.navigate(['/lista-productos'], { replaceUrl: true });
    }
  }
}
