from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import Categoria, Producto, Pedido, DetallePedido, Tienda

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.ReadOnlyField(source='categoria.nombre')
    class Meta:
        model = Producto
        fields = '__all__'

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = ['producto', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True)

    # --- DOBLE CANDADO: Validadores explícitos en el Serializer ---
    # Esto asegura que Django REST Framework rechace datos basura antes de procesar nada
    nombre = serializers.CharField(
        validators=[RegexValidator(regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', message='Este campo solo debe contener letras.')]
    )
    apellidos = serializers.CharField(
        validators=[RegexValidator(regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', message='Este campo solo debe contener letras.')]
    )
    telefono = serializers.CharField(
        validators=[RegexValidator(regex=r'^\d{10}$', message='El teléfono debe tener exactamente 10 dígitos numéricos.')]
    )

    class Meta:
        model = Pedido
        fields = ['id', 'email', 'nombre', 'apellidos', 'cedula', 'telefono', 
                  'metodo_envio', 'direccion_envio', 'total', 'detalles', 'fecha_pedido', 'pagado']
        read_only_fields = ['pagado', 'fecha_pedido']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        
        # VERIFICACIÓN DE STOCK
        for detalle_data in detalles_data:
            producto = detalle_data['producto']
            if producto.stock < detalle_data['cantidad']:
                raise serializers.ValidationError(
                    {"error": f"Stock insuficiente. Solo quedan {producto.stock} unidades de '{producto.nombre}'."}
                )

        pedido = Pedido.objects.create(**validated_data)
        
        for detalle_data in detalles_data:
            DetallePedido.objects.create(pedido=pedido, **detalle_data)
            producto = detalle_data['producto']
            producto.stock -= detalle_data['cantidad']
            producto.save()
                
        return pedido

class TiendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tienda
        fields = '__all__'
        fields = '__all__'