import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { cartItemApi } from '../api/cartItemApi';

const styles = {
    container: {
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #2a2a2a',
        maxWidth: '900px',
        margin: '20px auto',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        borderBottom: '1px solid #2a2a2a',
        paddingBottom: '15px',
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #222',
        flexWrap: 'wrap',
        gap: '10px',
    },
    itemDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    itemName: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#fff',
    },
    itemPrice: {
        color: '#a0a0a0',
        fontSize: '0.9rem',
    },
    quantityInput: {
        width: '60px',
        padding: '8px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '6px',
        color: '#fff',
        textAlign: 'center',
    },
    actionBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    footer: {
        marginTop: '25px',
        textAlign: 'right',
        borderTop: '1px solid #222',
        paddingTop: '20px',
    },
    total: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#00d4ff',
        marginBottom: '15px',
    },
    checkoutBtn: {
        padding: '12px 30px',
        backgroundColor: '#7b2ffc',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 4px 12px rgba(123, 47, 252, 0.4)',
    },
    loadingMsg: {
        textAlign: 'center',
        padding: '20px',
        color: '#a0a0a0',
    },
    emptyMsg: {
        textAlign: 'center',
        padding: '40px',
        color: '#a0a0a0',
        fontSize: '1.2rem',
    }
};

export default function CartView({ cartId, onCheckout }) {
    const { cart, loading, error, refetch } = useCart(cartId);
    const [updatingId, setUpdatingId] = useState(null);

    console.log('🛒 CartView - cartId:', cartId);
    console.log('🛒 CartView - cart:', cart);

    if (loading) return <p style={styles.loadingMsg}>Cargando carrito...</p>;
    if (error) {
        console.error('🛒 Error:', error);
        return <p style={styles.loadingMsg}>Error al cargar el carrito: {error}</p>;
    }
    
    if (!cart) return <p style={styles.loadingMsg}>No hay carrito</p>;
    
    const items = cart.items || [];
    console.log('🛒 Items a mostrar:', items);
    
    if (items.length === 0) {
        return <p style={styles.emptyMsg}>Tu carrito está vacío. Agrega productos desde la sección "Productos".</p>;
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
        <div style={styles.container}>
            <h2 style={styles.title}>Mi Carrito</h2>
            {items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                    <div style={styles.itemDetails}>
                        <div style={styles.itemName}>{item.product_name || 'Producto'}</div>
                        <div style={styles.itemPrice}>Precio unitario: ${item.unit_price}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            disabled={updatingId === item.id}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                            style={styles.quantityInput}
                        />
                        <span style={{ fontWeight: '500' }}>
                            Subtotal: ${item.subtotal || (item.quantity * item.unit_price)}
                        </span>
                        <button
                            onClick={() => handleRemove(item.id)}
                            disabled={updatingId === item.id}
                            style={{
                                ...styles.actionBtn,
                                backgroundColor: '#dc3545',
                                color: 'white'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
            <div style={styles.footer}>
                <h3 style={styles.total}>Total: ${cart.total || 0}</h3>
                <button
                    onClick={onCheckout}
                    style={styles.checkoutBtn}
                    onMouseEnter={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(123, 47, 252, 0.6)';}}
                    onMouseLeave={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(123, 47, 252, 0.4)';}}
                >
                    Proceder al pago
                </button>
            </div>
        </div>
    );
}