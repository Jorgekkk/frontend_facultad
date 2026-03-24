import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  nombreUsuario: string = '';
  fotoPreview: string | null = null;
  fileParaSubir: File | null = null;
  userId: string = '';

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.userId = localStorage.getItem('user_id') || '';

    // Verificación de seguridad: si no hay ID o si parece un número falso (como el '2')
    if (!this.userId || this.userId === '2') {
      alert('Error: Sesión no válida. Por favor, vuelve a iniciar sesión.');
      // Opcional: podrías redirigir al login aquí
    } else {
      this.cargarDatosPerfil();
    }
  }

  async cargarDatosPerfil() {
    const { data, error } = await this.supabase.getPerfil(this.userId);
    if (data) {
      this.nombreUsuario = data.nombre_completo;
      this.fotoPreview = data.avatar_url;
    } else {
      console.error('No se pudo cargar el perfil:', error);
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

  async guardarCambios() {
    if (!this.userId || this.userId === '2') {
      alert('No puedes guardar cambios sin iniciar sesión correctamente.');
      return;
    }

    try {
      let urlAvatar = this.fotoPreview;

      if (this.fileParaSubir) {
        urlAvatar = await this.supabase.subirAvatar(this.fileParaSubir, this.userId);
      }

      await this.supabase.actualizarPerfil(this.userId, {
        nombre_completo: this.nombreUsuario,
        avatar_url: urlAvatar
      });

      alert('¡Perfil actualizado con éxito!');

      // Actualizamos el nombre en el Navbar de inmediato (opcional, pero buena práctica)
      window.location.reload();

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al actualizar el perfil');
    }
  }
}
