import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api';
import { ProductCardComponent, Producto } from '../../shared/product-card/product-card';
import { SidebarCategoriasComponent } from '../../shared/sidebar-categorias/sidebar-categorias';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent, SidebarCategoriasComponent],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  readonly productos       = signal<Producto[]>([]);
  readonly cargando        = signal(true);
  readonly categoriaFiltro = signal('');

  readonly todasLasCategorias = computed(() =>
    [...new Set(this.productos().map(p => p.categoria))].sort()
  );

  readonly productosFiltrados = computed(() => {
    const cat = this.categoriaFiltro();
    return cat
      ? this.productos().filter(p => p.categoria === cat)
      : this.productos();
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const termino    = params['search'];
      const categoriaId = params['categoria']; // ← nombre que viene del home

      this.cargando.set(true);

      if (termino) {
        // Búsqueda por texto
        this.categoriaFiltro.set('');
        this.apiService.buscarProductos(termino).subscribe({
          next: (data) => {
            this.productos.set(
              data.filter(p => p.nombre.toLowerCase().includes(termino.toLowerCase()))
            );
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error al buscar:', err);
            this.cargando.set(false);
          }
        });

      } else if (categoriaId) {
        // Viene desde el home con ?categoria=NombreCategoria
        this.apiService.getProductos().subscribe({
          next: (data) => {
            this.productos.set(data);
            this.categoriaFiltro.set(categoriaId); // activa el filtro del sidebar
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error al cargar por categoría:', err);
            this.cargando.set(false);
          }
        });

      } else {
        // Catálogo completo sin filtro
        this.categoriaFiltro.set('');
        this.apiService.getProductos().subscribe({
          next: (data) => {
            this.productos.set(data);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error al cargar catálogo:', err);
            this.toastService.showError('Error de servidor: No se pudieron cargar los productos.');
            this.cargando.set(false);
          }
        });
      }
    });
  }
}