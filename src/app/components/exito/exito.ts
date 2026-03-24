import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-exito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exito.html',
  styleUrls: ['./exito.scss']
})
export class ExitoComponent implements OnInit {
  constructor(private carritoService: CarritoService) {}
  ngOnInit() {
    this.carritoService.vaciarCarrito();
    console.log('✅ Compra exitosa. El carrito ha sido vaciado.');
  }
}
