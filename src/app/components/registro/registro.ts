import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// Importamos Supabase en lugar de ApiService
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {
  // Esta es la variable que usaremos en el HTML
  registroData = { username: '', email: '', password: '' };

  constructor(private supabase: SupabaseService, private router: Router) {}

  // Esta es la función que se llama al darle click al botón
  async onRegistro() {
    try {
      // Usamos el servicio de Supabase para crear la cuenta
      const { data, error } = await this.supabase.crearCuenta(
        this.registroData.email,
        this.registroData.password,
        this.registroData.username
      );

      if (error) {
        alert('Error al registrar: ' + (error as any).message);
      } else {
        alert('¡Cuenta creada con éxito!');
        this.router.navigate(['/login']);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Ocurrió un error al intentar registrarte.');
    }
  }
}
