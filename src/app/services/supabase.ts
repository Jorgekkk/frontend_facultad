import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Obtener perfil del usuario logueado
  async getPerfil(userId: string) {
    return await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();
  }

  // Subir imagen al bucket 'imagenes-productos'
  async subirAvatar(file: File, userId: string) {
    const filePath = `avatars/${userId}-${Math.random()}.${file.name.split('.').pop()}`;
    const { data, error } = await this.supabase.storage
      .from('imagenes-productos')
      .upload(filePath, file);

    if (error) throw error;

    // Obtener la URL pública para guardarla en la tabla
    const { data: urlData } = this.supabase.storage.from('imagenes-productos').getPublicUrl(filePath);
    return urlData.publicUrl;
  }

  // Actualizar nombre y foto en la tabla perfiles
  async actualizarPerfil(userId: string, updates: any) {
    return await this.supabase
      .from('perfiles')
      .upsert({ id: userId, ...updates });
  }
}
