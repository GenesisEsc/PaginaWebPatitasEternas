import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ApiService } from './core/services/api'; // 1. Nueva ruta corregida
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ToastComponent } from './shared/toast/toast'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  respuesta: any;
  
  // 2. Usamos 'inject' que es más moderno o corregimos el constructor
  private apiService = inject(ApiService);

  ngOnInit() {
    console.log("Verificando conexión con el Backend de Byron...");
    
    // 3. Tipamos 'data' y 'error' como :any para quitar los errores TS7006
    this.apiService.getProductos().subscribe({
      next: (data: any) => {
        this.respuesta = data;
        console.log('✅ Conexión exitosa. Productos cargados:', data.length);
      },
      error: (error: any) => {
        console.error('❌ Error de conexión al servidor Django:', error);
      }
    });
  }
}