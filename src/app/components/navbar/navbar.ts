import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  nombreUsuario: string = '';
  avatarUrl: string | null = null;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      const { data, error } = await this.supabase.getPerfil(userId);
      if (data) {
        this.nombreUsuario = data.nombre_completo;
        this.avatarUrl = data.avatar_url;
      }
    }
  }
}