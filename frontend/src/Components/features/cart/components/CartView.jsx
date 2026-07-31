import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { cartItemApi } from '../api/cartItemApi';

export default function CartView({ cartId, onCheckout }) {
    const { cart, loading, error, refetch } = useCart(cartId);
    const [updatingId, setUpdatingId] = useState(null);

    console.log('🛒 CartView - cartId:', cartId);
    console.log('🛒 CartView - cart:', cart);

    if (loading) return <p>Cargando carrito...</p>;
    if (error) {
        console.error('🛒 Error:', error);
        return <p>Error al cargar el carrito: {error}</p>;
    }
    
    if (!cart) return <p>No hay carrito</p>;
    
    const items = cart.items || [];
    console.log('🛒 Items a mostrar:', items);
    
    if (items.length === 0) {
        return <p>Tu carrito está vacío. Agrega productos desde la sección "Productos".</p>;
    }

    const handleQuantityChange = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        setUpdatingId(cartItemId);
        try {
            console.log('🔄 Actualizando cantidad:', { cartItemId, quantity });
            const response = await cartItemApi.actualizar(cartItemId, { quantity });
            console.log('✅ Respuesta actualizar:', response.data);
            await refetch();
        } catch (err) {
            console.error('❌ Error al actualizar cantidad:', err);
            alert('Error al actualizar la cantidad: ' + (err.response?.data?.message || err.message));
        }
        setUpdatingId(null);
    };

    const handleRemove = async (cartItemId) => {
        setUpdatingId(cartItemId);
        try {
            console.log('🗑️ Eliminando item:', cartItemId);
            await cartItemApi.eliminar(cartItemId);
            await refetch();
        } catch (err) {
            console.error('❌ Error al eliminar:', err);
            alert('Error al eliminar el producto: ' + (err.response?.data?.message || err.message));
        }
        setUpdatingId(null);
    };

    return (
        <div>
            <h2>Mi Carrito</h2>
            {items.map((item) => (
                <div
                    key={item.id}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px solid #ddd',
                        flexWrap: 'wrap',
                        gap: '10px',
                    }}
                >
                    <div>
                        <strong>{item.product_name || 'Producto'}</strong>
                        <p style={{ margin: 0, color: '#666' }}>Precio unitario: ${item.unit_price}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            disabled={updatingId === item.id}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                            style={{ width: '60px', padding: '5px' }}
                        />
                        <span>Subtotal: ${item.subtotal || (item.quantity * item.unit_price)}</span>
                        <button
                            onClick={() => handleRemove(item.id)}
                            disabled={updatingId === item.id}
                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <h3>Total: ${cart.total || 0}</h3>
                <button
                    onClick={onCheckout}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Proceder al pago
                </button>
            </div>
        </div>
    );
}