import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent {
onRegistro() {
throw new Error('Method not implemented.');
}
  user = { username: '', email: '', password: '' };
registroData: any;

  constructor(private api: ApiService, private router: Router) {}

  onRegister() {
    this.api.registrar(this.user).subscribe({
      next: (res) => {
        alert('¡Usuario creado con éxito!');
        this.router.navigate(['/login']); // Te manda al login tras registrarte
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar: ' + JSON.stringify(err.error));
      }
    });
  }
}
