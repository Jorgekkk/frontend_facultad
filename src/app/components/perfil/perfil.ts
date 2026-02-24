import { Service } from './../../../../node_modules/@sigstore/protobuf-specs/dist/__generated__/sigstore_trustroot.d';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas básicas
import { FormsModule } from '@angular/forms'; // <--- ESTO FALTA
import { RouterModule } from '@angular/router'; // Para el routerLink del botón "Volver"
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-perfil',
  standalone: true, // Asegúrate de que sea standalone
  imports: [CommonModule, FormsModule, RouterModule], // <--- AGRÉGALOS AQUÍ
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
nombreCompleto: any;
guardarPerfil() {
throw new Error('Method not implemented.');
}
  nombreUsuario: string = '';
  fotoPreview: string | null = null;
  fileParaSubir: File | null = null;
  userId: string = ''; // Este ID lo recuperamos del token o localStorage

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
  // Recuperar el ID directamente como lo guardaste en el login
  this.userId = localStorage.getItem('user_id') || '';

  if (this.userId) {
    this.cargarDatosPerfil();
  }
}

  async cargarDatosPerfil() {
    const { data, error } = await this.supabase.getPerfil(this.userId);
    if (data) {
      this.nombreUsuario = data.nombre_completo;
      this.fotoPreview = data.avatar_url;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileParaSubir = file;
      // Generar previsualización local rápida
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  async guardarCambios() {
    try {
      let urlAvatar = this.fotoPreview;

      // Si el usuario seleccionó una foto nueva, subirla al bucket 'imagenes-productos'
      if (this.fileParaSubir) {
        urlAvatar = await this.supabase.subirAvatar(this.fileParaSubir, this.userId);
      }

      // Actualizar la tabla 'perfiles' en Supabase
      await this.supabase.actualizarPerfil(this.userId, {
        nombre_completo: this.nombreUsuario,
        avatar_url: urlAvatar
      });

      alert('¡Perfil actualizado con éxito!');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al actualizar el perfil');
    }
  }
}
