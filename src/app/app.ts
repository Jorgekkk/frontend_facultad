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
    if (url === '/' || url.includes('/login') || url.includes('/registro') || url.includes('/perfil')) {
      this.mostrarNavbar = false;
    } else {
      this.mostrarNavbar = true;
    }
  }
}