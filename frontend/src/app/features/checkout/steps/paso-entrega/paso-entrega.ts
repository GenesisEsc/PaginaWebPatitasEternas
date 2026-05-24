import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paso-entrega',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './paso-entrega.html',
  styleUrl: './paso-entrega.css'
})
export class PasoEntregaComponent {
  @Output() siguiente = new EventEmitter<any>();
  @Output() anterior  = new EventEmitter<void>();
  
  private fb = new FormBuilder();
  
 form = this.fb.group({
    provincia: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)]],
    ciudad: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    referencia: ['']
  });
  mostrarError(campo: string): boolean {
    const control = this.form.get(campo);
    // Ahora se pone rojo si saliste del campo (touched) O si escribiste algo inválido (dirty)
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  getError(campo: string): string {
    const errors = this.form.get(campo)?.errors;
    if (!errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      provincia: {
        required: 'La provincia es obligatoria.',
        pattern: 'La provincia solo puede contener letras.'
      },
      ciudad: {
        required: 'La ciudad es obligatoria.',
        pattern: 'La ciudad solo puede contener letras.'
      },
      direccion: {
        required: 'La dirección es obligatoria.',
        minlength: 'La dirección es muy corta, sé más específico.'
      }
    };

    const campoMensajes = mensajes[campo] || {};
    const primerError = Object.keys(errors)[0];
    return campoMensajes[primerError] || 'Campo inválido.';
  }

  onSiguiente(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.siguiente.emit({
        direccion_envio: this.form.value.direccion + ', ' + this.form.value.ciudad,
        metodo_envio: 'DOMICILIO' // o lo que corresponda
      });
    }
  }
}