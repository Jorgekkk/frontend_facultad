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
        // Guardamos el token en el almacenamiento local del navegador
        localStorage.setItem('token', res.access); 
        alert('¡Bienvenido!');
        this.router.navigate(['/lista-productos']); // A donde quieras ir después
      },
      error: (err) => {
        alert('Credenciales incorrectas');
      }
    });
  }
}