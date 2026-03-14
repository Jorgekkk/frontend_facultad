import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar'; 
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, NavbarComponent], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend_facultad');
  
  // 1. Iniciamos en FALSE para que no parpadee al abrir la app
  mostrarNavbar: boolean = false;

  constructor(private router: Router) {
    // Escuchamos cada vez que te mueves entre páginas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      
      // 2. urlAfterRedirects atrapa la ruta real (incluso si Angular te redirige)
      const urlActual = event.urlAfterRedirects || event.url;
      
      // 3. Si estás en la raíz '/' o en '/login', lo mantenemos apagado
      if (urlActual === '/' || urlActual.includes('/login')) {
        this.mostrarNavbar = false;
      } else {
        this.mostrarNavbar = true;
      }
      
    });
  }

  // 4. DOBLE CANDADO: Verifica la ruta en el instante en que la app arranca
  ngOnInit() {
    const urlActual = this.router.url;
    if (urlActual === '/' || urlActual.includes('/login')) {
      this.mostrarNavbar = false;
    } else {
      this.mostrarNavbar = true;
    }
  }
}