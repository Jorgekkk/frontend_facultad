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
  
  mostrarNavbar: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      
      const urlActual = event.urlAfterRedirects || event.url;
      
      if (urlActual === '/' || urlActual.includes('/login') || urlActual.includes('/registro')) {
        this.mostrarNavbar = false;
      } else {
        this.mostrarNavbar = true;
      }
      
    });
  }

  ngOnInit() {
    const urlActual = this.router.url;
    if (urlActual === '/' || urlActual.includes('/login') || urlActual.includes('/registro')) {
      this.mostrarNavbar = false;
    } else {
      this.mostrarNavbar = true;
    }
  }
}