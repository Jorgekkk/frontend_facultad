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

  // 1. Sube la foto del producto al bucket
  async subirFotoProducto(file: File) {
    const filePath = `productos/${Date.now()}-${file.name}`;
    const { error } = await this.supabase.storage
      .from('imagenes-productos')
      .upload(filePath, file);

    if (error) throw error;

    // Obtiene el link público
    const { data } = this.supabase.storage.from('imagenes-productos').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // 2. Guarda el producto en la tabla 'productos'
  async crearProducto(producto: any) {
    const { data, error } = await this.supabase
      .from('productos')
      .insert([producto]); // Supabase pide que sea un array

    if (error) throw error;
    return data;
  }

  async obtenerProductos() {
  const { data, error } = await this.supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: false }); // Para que lo más nuevo salga primero
  return { data, error };
}

  async iniciarSesion(email: string, password: string) {
  return await this.supabase.auth.signInWithPassword({ email, password });
}

async crearCuenta(email: string, password: string, nombreCompleto: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: nombreCompleto,
        }
      }
    });

    if (error) throw error;

    // Si se crea correctamente en Auth, lo guardamos en perfiles
    if (data.user) {
        const { error: perfilError } = await this.supabase.from('perfiles').insert({
            id: data.user.id,
            nombre_completo: nombreCompleto
        });

        if (perfilError) {
             console.error('Error al crear el perfil público:', perfilError);
        }
    }

    return { data, error };
  }
}
