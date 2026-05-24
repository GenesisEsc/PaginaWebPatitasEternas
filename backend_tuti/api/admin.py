from django.contrib import admin
from .models import Categoria, Producto, Pedido, DetallePedido, Tienda

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock', 'activo')
    list_filter = ('categoria', 'activo')
    search_fields = ('nombre', 'descripcion')
    list_editable = ('precio', 'stock', 'activo')

# Hacemos que los detalles se vean dentro del mismo formulario del Pedido
class DetallePedidoInline(admin.TabularInline):
    model = DetallePedido
    extra = 0
    readonly_fields = ('precio_unitario',)

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellidos', 'email', 'total', 'pagado', 'fecha_pedido')
    list_filter = ('pagado', 'metodo_envio', 'fecha_pedido')
    search_fields = ('nombre', 'apellidos', 'cedula', 'email')
    inlines = [DetallePedidoInline]

# Registro de las tiendas
@admin.register(Tienda)
class TiendaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ciudad', 'provincia')
    list_filter = ('provincia', 'ciudad')
    search_fields = ('nombre', 'direccion')