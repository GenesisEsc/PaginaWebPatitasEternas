import { Component, signal, computed, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Tienda } from '../../core/services/api';
import { ToastService } from '../../core/services/toast';
import * as L from 'leaflet';

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locales.html',
  styleUrl: './locales.css',
})
export class LocalesComponent implements AfterViewInit {

  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private map: any;
  private marcadores: L.Marker[] = [];

  todasLasTiendas = signal<Tienda[]>([]);
  filtroProvincia = signal('Todas');
  tiendaSeleccionada = signal<Tienda | null>(null);

  tiendasFiltradas = computed(() => {
    const prov = this.filtroProvincia();
    const tiendas = this.todasLasTiendas();
    return prov === 'Todas' ? tiendas : tiendas.filter(t => t.provincia === prov);
  });

  ngAfterViewInit() {
    this.iniciarMapa();

    this.apiService.getLocales().subscribe({
      next: (data) => {
  console.log('Tiendas recibidas:', JSON.stringify(data));
  this.todasLasTiendas.set(data);
  this.actualizarMarcadores();
},
      error: (err) => {
        console.error('Error cargando locales desde el backend', err);
        this.toastService.showError('Error de servidor: No se pudieron cargar los locales.');
      }
    });
  }

  private iniciarMapa(): void {
    this.map = L.map('contenedor-mapa').setView([-1.8312, -78.1834], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  private iconoLeaflet(): L.Icon {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }

  private actualizarMarcadores(): void {
    if (!this.map) return;

    this.marcadores.forEach(m => m.remove());
    this.marcadores = [];

    const icono = this.iconoLeaflet();

    this.tiendasFiltradas().forEach(tienda => {
      const marker = L.marker([tienda.latitud, tienda.longitud], { icon: icono })
        .addTo(this.map)
        .bindPopup(`<b>${tienda.nombre}</b><br>${tienda.direccion}`);

      marker.on('click', () => this.seleccionarTienda(tienda));
      this.marcadores.push(marker);
    });
  }

  cambiarProvincia(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.filtroProvincia.set(valor);
    this.actualizarMarcadores();

    if (valor === 'Pichincha') this.map.setView([-0.2299, -78.5249], 11);
    else if (valor === 'Guayas') this.map.setView([-2.1894, -79.8891], 11);
    else this.map.setView([-1.8312, -78.1834], 7);
  }

  seleccionarTienda(tienda: Tienda) {
    this.tiendaSeleccionada.set(tienda);
    if (this.map) {
      this.map.setView([tienda.latitud, tienda.longitud], 16);
    }
  }
}