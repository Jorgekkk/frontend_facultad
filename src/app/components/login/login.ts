import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// 1. Importamos Supabase en lugar de ApiService
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // 2. Supabase usa correos, así que cambiamos 'username' por 'email'
  credentials = { email: '', password: '' };

  constructor(private supabase: SupabaseService, private router: Router) {}

  async onLogin() {
    try {
      // 3. Iniciamos sesión directamente con Supabase
      const { data, error } = await this.supabase.iniciarSesion(
        this.credentials.email,
        this.credentials.password
      );

      if (error) {
        alert('Credenciales incorrectas: ' + error.message);
        return;
      }

      if (data && data.user) {
        // 4. ¡AQUÍ ESTÁ LA MAGIA! Guardamos el UUID larguísimo y correcto
        localStorage.setItem('user_id', data.user.id);
        console.log('ID de usuario guardado:', data.user.id);

        alert('¡Bienvenido!');
        this.router.navigate(['/lista-productos']);
      }
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err);
    }
  }
}
