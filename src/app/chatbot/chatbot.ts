import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.scss']
})
export class ChatbotComponent {
  abierto = false;
  mensajeUsuario = '';
  cargando = false;

  // Historial inicial del chat
  mensajes: { emisor: 'bot' | 'usuario', texto: string }[] = [
    { emisor: 'bot', texto: '¡Hola! Soy el asistente de VEN FCC. ¿En qué te puedo ayudar?' }
  ];

  constructor(private apiService: ApiService) {}

  toggleChat() {
    this.abierto = !this.abierto;
  }

  enviarMensaje() {
    if (!this.mensajeUsuario.trim()) return;

    // 1. Agregamos el mensaje del usuario al chat
    const textoEnviado = this.mensajeUsuario;
    this.mensajes.push({ emisor: 'usuario', texto: textoEnviado });
    this.mensajeUsuario = ''; // Limpiamos el input
    this.cargando = true;

    // 2. Llamamos a la API (tu microservicio)
    this.apiService.enviarMensajeChat(textoEnviado).subscribe({
      next: (res) => {
        // Agregamos la respuesta de la IA al chat
        this.mensajes.push({ emisor: 'bot', texto: res.respuesta });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error del bot:', err);
        this.mensajes.push({ emisor: 'bot', texto: 'Uy, parece que perdí la conexión. ¿Podemos intentar de nuevo?' });
        this.cargando = false;
      }
    });
  }
}
