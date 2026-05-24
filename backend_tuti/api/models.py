from django.db import models
from django.core.validators import MinValueValidator, RegexValidator

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name='Nombre de la Categoría')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, related_name='productos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200, verbose_name='Nombre del Producto')
    descripcion = models.TextField(verbose_name='Descripción')
    # Validadores de seguridad agregados aquí:
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)], verbose_name='Precio ($)')
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)], verbose_name='Stock Disponible')
    imagen = models.URLField(max_length=500, blank=True, null=True, verbose_name='URL de la Imagen')
    activo = models.BooleanField(default=True, verbose_name='¿Está activo?')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - ${self.precio}"

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-fecha_creacion']

# --- NUEVO MODELO GUEST CHECKOUT ---

class Pedido(models.Model):
    # --- NUEVOS VALIDADORES ---
    letras_validator = RegexValidator(regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', message='Este campo solo debe contener letras.')
    telefono_validator = RegexValidator(regex=r'^\d{10}$', message='El teléfono debe tener exactamente 10 dígitos numéricos.')

    # Datos del cliente invitado
    email = models.EmailField(verbose_name='Correo Electrónico')
    nombre = models.CharField(max_length=100, validators=[letras_validator], verbose_name='Nombres')
    apellidos = models.CharField(max_length=100, validators=[letras_validator], verbose_name='Apellidos')
    cedula = models.CharField(max_length=15, verbose_name='Cédula / RUC')
    telefono = models.CharField(max_length=20, validators=[telefono_validator], verbose_name='Teléfono')

    # Datos de entrega
    METODOS_ENVIO = [
        ('TIENDA', 'Retiro en tienda'),
        ('DOMICILIO', 'Envío a domicilio'),
    ]
    metodo_envio = models.CharField(max_length=20, choices=METODOS_ENVIO, default='TIENDA')
    direccion_envio = models.TextField(blank=True, null=True, verbose_name='Dirección de Envío')
    
    # Metadatos del pedido
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Total a Pagar ($)')
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    pagado = models.BooleanField(default=False, verbose_name='¿Pago confirmado?')

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre} {self.apellidos}"

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-fecha_pedido']

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True) # SET_NULL para no borrar el historial si eliminamos el producto de la tienda
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, help_text="Precio al momento de la compra")

    def __str__(self):
        producto_nombre = self.producto.nombre if self.producto else "Producto Eliminado"
        return f"{self.cantidad}x {producto_nombre} (Pedido #{self.pedido.id})"

# --- NUEVO MODELO TIENDAS ---

class Tienda(models.Model):
    nombre = models.CharField(max_length=100, verbose_name='Nombre del Local')
    provincia = models.CharField(max_length=50, verbose_name='Provincia')
    ciudad = models.CharField(max_length=50, verbose_name='Ciudad')
    direccion = models.TextField(verbose_name='Dirección Exacta')
    latitud = models.DecimalField(max_digits=9, decimal_places=6, help_text='Ej: -0.180653')
    longitud = models.DecimalField(max_digits=9, decimal_places=6, help_text='Ej: -78.467834')

    def __str__(self):
        return f"{self.nombre} - {self.ciudad}"

    class Meta:
        verbose_name = 'Tienda'
        verbose_name_plural = 'Tiendas'