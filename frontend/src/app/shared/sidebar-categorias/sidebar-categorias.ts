// src/app/shared/sidebar-categorias/sidebar-categorias.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-categorias',
  standalone: true,
  templateUrl: './sidebar-categorias.html',
  styleUrl: './sidebar-categorias.css'
})
export class SidebarCategoriasComponent {
  // Lista de categorías que llega desde el componente padre (catálogo)
  @Input() categorias: string[] = [];

  // Categoría actualmente seleccionada
  @Input() categoriaActiva = '';

  // Evento que emite la categoría elegida al padre
  @Output() categoriaSeleccionada = new EventEmitter<string>();

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada.emit(cat);
  }
}