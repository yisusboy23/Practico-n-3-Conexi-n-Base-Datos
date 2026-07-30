import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { cartItemApi } from '../api/cartItemApi';

export default function CartView({ cartId, onCheckout }) {
    const { cart, loading, error, refetch } = useCart(cartId);
    const [updatingId, setUpdatingId] = useState(null);

    if (loading) return <p>Cargando carrito...</p>;
    if (error) return <p>Error al cargar el carrito.</p>;
    if (!cart || !cart.items || cart.items.length === 0) {
        return <p>Tu carrito está vacío. Agrega productos desde la sección "Productos".</p>;
    }

    const handleQuantityChange = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        setUpdatingId(cartItemId);
        try {
            await cartItemApi.actualizar(cartItemId, { quantity });
            await refetch();
        } catch (err) {
            alert('Error al actualizar la cantidad');
        }
        setUpdatingId(null);
    };

    const handleRemove = async (cartItemId) => {
        setUpdatingId(cartItemId);
        try {
            await cartItemApi.eliminar(cartItemId);
            await refetch();
        } catch (err) {
            alert('Error al eliminar el producto');
        }
        setUpdatingId(null);
    };

    return (
        <div>
            <h2>Mi Carrito</h2>
            {cart.items.map((item) => (
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
                        <strong>{item.product_name}</strong>
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
                        <span>Subtotal: ${item.subtotal}</span>
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
                <h3>Total: ${cart.total}</h3>
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
