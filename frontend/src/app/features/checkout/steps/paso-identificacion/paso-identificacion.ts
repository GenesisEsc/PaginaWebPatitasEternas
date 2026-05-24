import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// ─── Validador personalizado: Cédula Ecuatoriana ────────────────────────────
// Aplica el algoritmo módulo 10 del Registro Civil del Ecuador
function validarCedulaEcuatoriana(control: AbstractControl): ValidationErrors | null {
  const cedula = control.value as string;

  // 1. Debe tener exactamente 10 dígitos
  if (!cedula || cedula.length !== 10 || !/^\d{10}$/.test(cedula)) {
    return { cedulaInvalida: 'La cédula debe tener exactamente 10 dígitos numéricos.' };
  }

  // 2. Los dos primeros dígitos son la provincia (01-24)
  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return { cedulaInvalida: 'Código de provincia inválido (01-24).' };
  }

  // 3. Algoritmo módulo 10 (dígito verificador)
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]; // alternados 2 y 1
  const digitoVerificador = parseInt(cedula[9], 10);  // último dígito

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i];
    if (valor >= 10) valor -= 9; // si el resultado >= 10, restar 9
    suma += valor;
  }

  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

  if (digitoCalculado !== digitoVerificador) {
    return { cedulaInvalida: 'El número de cédula no es válido.' };
  }

  return null; // Cédula válida
}
// ────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-paso-identificacion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl:'./paso-identificacion.html',
  styleUrl: './paso-identificacion.css',
})
export class PasoIdentificacionComponent {
  @Output() siguiente = new EventEmitter<any>();
  @Output() anterior  = new EventEmitter<void>();

  private fb = new FormBuilder();

  // Formulario reactivo con todas las validaciones cerradas correctamente
  form = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    nombre: ['', [
      Validators.required, 
      Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/),
      Validators.minLength(2)
    ]],
    apellido: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/),
      Validators.minLength(2)
    ]],
    cedula: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/),
      validarCedulaEcuatoriana  // ← Nuestro validador personalizado
    ]],
    telefono: ['', [
      Validators.required,
      Validators.pattern(/^09\d{8}$/) // Formato: 09XXXXXXXX (10 dígitos)
    ]]
  }); // <-- ¡Aquí estaba el error! Faltaba cerrar el formulario antes de crear funciones.

  /** Verifica si debe mostrarse el error de un campo */
  mostrarError(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  /** Retorna el mensaje de error apropiado para cada campo */
  getError(campo: string): string {
    const errors = this.form.get(campo)?.errors;
    if (!errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      email: {
        required: 'El correo es obligatorio.',
        email:    'Ingresa un correo electrónico válido.'
      },
      nombre: {
        required:  'El nombre es obligatorio.',
        minlength: 'El nombre debe tener al menos 2 caracteres.',
        pattern:   'El nombre solo puede contener letras y espacios.'
      },
      apellido: {
        required:  'El apellido es obligatorio.',
        minlength: 'El apellido debe tener al menos 2 caracteres.',
        pattern:   'El apellido solo puede contener letras y espacios.'
      },
      cedula: {
        required:       'La cédula es obligatoria.',
        pattern:        'La cédula debe tener 10 dígitos numéricos.',
        cedulaInvalida: errors['cedulaInvalida'] as string
      },
      telefono: {
        required: 'El teléfono es obligatorio.',
        pattern:  'Formato inválido. Usa: 09XXXXXXXX (10 dígitos).'
      }
    };

    const campoMensajes = mensajes[campo] || {};
    const primerError   = Object.keys(errors)[0];
    return campoMensajes[primerError] || 'Campo inválido.';
  }

  onSiguiente(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.siguiente.emit(this.form.value); // ¡Aquí enviamos los datos!
    }
  }
}