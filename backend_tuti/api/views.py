from rest_framework import viewsets, permissions, filters
from .models import Categoria, Producto, Pedido, Tienda
from .serializers import CategoriaSerializer, ProductoSerializer, PedidoSerializer, TiendaSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.AllowAny]

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]
    
    # -- Configuración del Buscador ---
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion'] 

    # --- Filtro para que las categorías del Home funcionen ---
    def get_queryset(self):
        # Empezamos con todos los productos activos
        queryset = Producto.objects.filter(activo=True)
        
        # Atrapamos si el frontend manda un ID de categoría en la URL
        categoria_id = self.request.query_params.get('categoria', None)
        
        # Si sí mandó una categoría, filtramos los productos
        if categoria_id is not None:
            queryset = queryset.filter(categoria_id=categoria_id)
            
        return queryset

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny] # Permite Guest Checkout
    http_method_names = ['post'] # Solo permitimos crear pedidos (POST)

# --- Endpoint de Tiendas ---
class TiendaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tienda.objects.all()
    serializer_class = TiendaSerializer
    permission_classes = [permissions.AllowAny]