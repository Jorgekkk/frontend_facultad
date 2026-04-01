import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-resenas-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenas-modal.html',
  styleUrls: ['./resenas-modal.scss']
})
export class ResenasModalComponent implements OnInit {
  @Input() producto: any; // Recibe el producto desde la lista
  @Output() cerrarModal = new EventEmitter<void>(); // Avisa para cerrar la ventana

  resenas: any[] = [];
  cargando = true;

  // Datos del formulario
  nuevaResena = {
    nombreUsuario: '',
    calificacion: 5,
    comentario: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.cargando = true;
    // Asumimos que tu producto tiene un campo 'id'
    this.apiService.getResenas(this.producto.id).subscribe({
      next: (data) => {
        this.resenas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  enviarResena() {
    if (!this.nuevaResena.nombreUsuario || !this.nuevaResena.comentario) {
      alert('Por favor llena todos los campos');
      return;
    }

    const payload = {
      productoId: this.producto.id,
      nombreUsuario: this.nuevaResena.nombreUsuario,
      calificacion: this.nuevaResena.calificacion,
      comentario: this.nuevaResena.comentario
    };

    this.apiService.crearResena(payload).subscribe({
      next: () => {
        this.cargarResenas(); // Recarga la lista para ver el nuevo comentario
        this.nuevaResena.comentario = ''; // Limpiamos el formulario
      },
      error: (err) => console.error('Error al guardar', err)
    });
  }
}
