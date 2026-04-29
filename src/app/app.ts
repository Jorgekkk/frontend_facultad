import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { filter } from 'rxjs/operators';
import { ChatbotComponent } from './chatbot/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend_facultad');

  mostrarNavbar: boolean = false;
  mostrarChatbot: boolean = true; // <-- NUEVA VARIABLE

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.evaluarRutas(event.urlAfterRedirects || event.url);
    });
  }

  ngOnInit() {
    this.evaluarRutas(this.router.url);
  }

   private evaluarRutas(url: string) {
    // 1. Lógica para mostrar/ocultar el Navbar (como ya lo tenías)
    if (url === '/' || url.includes('/login') || url.includes('/registro') || url.includes('/perfil')) {
      this.mostrarNavbar = false;
    } else {
      this.mostrarNavbar = true;
    }

    // 2. Lógica para mostrar/ocultar el Chatbot
    // Lo ocultamos en login y registro, pero sí se mostrará en el perfil y la tienda
    if (url === '/' || url.includes('/login') || url.includes('/registro')) {
      this.mostrarChatbot = false;
    } else {
      this.mostrarChatbot = true;
    }
  }
}
