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
        // Guardamos el token para las peticiones a Django
        localStorage.setItem('token', res.access);
        
        // GUARDAR EL ID: Importante para vincular con la tabla 'perfiles' de Supabase
        // Asumiendo que tu backend devuelve el user_id o el objeto user
        if (res.user_id) {
          localStorage.setItem('user_id', res.user_id);
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
