import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    this.api.login(this.credentials).subscribe({
      next: (res: any) => {
        // 1. Guardamos el token
        localStorage.setItem('token', res.access);

        // 2. MAGIA: Extraemos el ID del usuario oculto dentro del token JWT
        try {
          const payload = JSON.parse(atob(res.access.split('.')[1]));
          // En Django SimpleJWT, el id suele venir como 'user_id'
          localStorage.setItem('user_id', payload.user_id);
          console.log('ID de usuario guardado:', payload.user_id);
        } catch(e) {
          console.error('No se pudo decodificar el token', e);
        }

        alert('¡Bienvenido!');
        this.router.navigate(['/lista-productos']);
      },
      error: (err) => {
        alert('Credenciales incorrectas');
      }
    });
  }
}
