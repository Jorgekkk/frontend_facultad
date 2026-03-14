import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './publicar.html',
  styleUrls: ['./publicar.scss']
})
export class PublicarComponent implements OnInit {
  // Modelo de datos del producto
  producto = {
    titulo: '',
    descripcion: '',
    precio: null,
    categoria: 'Electrónicos' // Por defecto
  };

  fotoPreview: string | null = null;
  fileParaSubir: File | null = null;
  cargando: boolean = false;
  userId: string = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.userId = localStorage.getItem('user_id') || '';
    if (!this.userId) {
      alert('Debes iniciar sesión para publicar');
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileParaSubir = file;
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  async publicar() {
    if (!this.producto.titulo || !this.producto.precio) {
      return alert('Por favor, llena el título y el precio.');
    }

    this.cargando = true;

    try {
      let imagenUrl = null;

      // 1. Si hay foto, la subimos primero
      if (this.fileParaSubir) {
        imagenUrl = await this.supabase.subirFotoProducto(this.fileParaSubir);
      }

      // 2. Armamos el objeto tal como lo pide tu tabla en Supabase
      const nuevoProducto = {
        vendedor_id: String(this.userId),
        titulo: this.producto.titulo,
        descripcion: this.producto.descripcion,
        precio: this.producto.precio,
        categoria: this.producto.categoria,
        imagen_url: imagenUrl
      };

      // 3. Guardamos en la base de datos
      await this.supabase.crearProducto(nuevoProducto);

      alert('¡Producto publicado con éxito en VEN FCC!');
      this.router.navigate(['/lista-productos']); // Lo regresamos a la tienda

    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Hubo un error al publicar el producto.');
    } finally {
      this.cargando = false;
    }
  }
}
