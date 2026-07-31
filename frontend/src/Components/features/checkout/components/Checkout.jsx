import { useEffect, useState } from 'react';
import { addressesApi } from '../../addresses/api/addressesApi';
import { checkoutApi } from '../api/checkoutApi';

const styles = {
    container: {
        maxWidth: '550px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '#141414',
        borderRadius: '16px',
        border: '1px solid #2a2a2a',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        color: '#e0e0e0',
    },
    title: {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#fff',
        fontSize: '1.8rem',
        borderBottom: '2px solid #7b2ffc',
        paddingBottom: '15px',
    },
    error: {
        color: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center',
        border: '1px solid #ff4d4d',
    },
    section: {
        marginBottom: '25px',
    },
    sectionTitle: {
        marginBottom: '12px',
        color: '#a0a0a0',
        fontSize: '1rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    addressLabel: {
        display: 'block',
        padding: '14px',
        backgroundColor: '#0f0f0f',
        border: '1px solid #333',
        borderRadius: '10px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '5px 0 12px 0',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#00d4ff',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '0.95rem',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    cancelBtn: {
        padding: '12px 20px',
        backgroundColor: 'transparent',
        border: '1px solid #444',
        borderRadius: '8px',
        color: '#a0a0a0',
        cursor: 'pointer',
        fontWeight: '600',
        transition: '0.2s',
    },
    confirmBtn: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#7b2ffc',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(123, 47, 252, 0.3)',
    },
    confirmBtnDisabled: {
        backgroundColor: '#2a2a2a',
        color: '#666',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    loading: {
        textAlign: 'center',
        color: '#a0a0a0',
    }
};

export default function Checkout({ cartId, user, onSuccess, onCancel }) {
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        recipient_name: '', line1: '', city: '', state: '', postal_code: '', country: '',
    });
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('🛒 Checkout - cartId:', cartId);
        console.log('👤 Checkout - user:', user);
        
        addressesApi.listar()
            .then((response) => {
                console.log('📦 Respuesta direcciones:', response.data);
                const allAddresses = response.data.data || response.data || [];
                const mine = allAddresses.filter((a) => a.user_id === user.id);
                console.log('📍 Direcciones del usuario:', mine);
                setAddresses(mine);
                if (mine.length > 0) {
                    setSelectedAddressId(mine[0].id);
                } else {
                    setShowNewAddress(true);
                }
            })
            .catch((err) => {
                console.error('❌ Error al cargar direcciones:', err);
                setError('Error al cargar tus direcciones');
            })
            .finally(() => setLoadingAddresses(false));
    }, [user.id]);

    const handleCreateAddress = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        try {
            console.log('📝 Creando dirección:', { ...newAddress, user_id: user.id });
            const response = await addressesApi.crear({ 
                ...newAddress, 
                user_id: user.id,
                is_default: true 
            });
            console.log('✅ Dirección creada:', response.data);
            
            const addressData = response.data.data || response.data;
            setAddresses((prev) => [...prev, addressData]);
            setSelectedAddressId(addressData.id);
            setShowNewAddress(false);
        } catch (err) {
            console.error('❌ Error al guardar dirección:', err);
            setError(err.response?.data?.message || 'Error al guardar la dirección');
        }
        setProcessing(false);
    };

    const handleConfirm = async () => {
        console.log('🛒 Confirmando pedido - cartId:', cartId);
        console.log('🛒 Confirmando pedido - selectedAddressId:', selectedAddressId);
        
        if (!selectedAddressId) {
            setError('Selecciona una dirección de envío');
            return;
        }
        
        if (!cartId) {
            setError('No hay carrito seleccionado');
            return;
        }
        
        setProcessing(true);
        setError('');
        try {
            console.log('📦 Enviando checkout:', { cart_id: cartId, address_id: selectedAddressId });
            const response = await checkoutApi.procesar({ 
                cart_id: cartId, 
                address_id: selectedAddressId 
            });
            console.log('✅ Pedido creado:', response.data);
            
            const orderData = response.data.data || response.data;
            onSuccess(orderData);
        } catch (err) {
            console.error('❌ Error al procesar pedido:', err);
            setError(err.response?.data?.message || 'Error al procesar el pedido');
        }
        setProcessing(false);
    };

    if (loadingAddresses) return <p style={styles.loading}>Cargando direcciones...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Finalizar Compra</h2>
            {error && <div style={styles.error}>{error}</div>}

            {addresses.length > 0 && !showNewAddress && (
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Dirección de envío</h4>
                    {addresses.map((addr) => (
                        <label
                            key={addr.id}
                            style={{
                                ...styles.addressLabel,
                                borderColor: String(selectedAddressId) === String(addr.id) ? '#7b2ffc' : '#333',
                                backgroundColor: String(selectedAddressId) === String(addr.id) ? '#1a1025' : '#0f0f0f',
                            }}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={String(selectedAddressId) === String(addr.id)}
                                onChange={() => setSelectedAddressId(addr.id)}
                                style={{ marginRight: '12px', accentColor: '#7b2ffc' }}
                            />
                            {addr.recipient_name} — {addr.line1}, {addr.city}, {addr.state}, {addr.country}
                        </label>
                    ))}
                    <button
                        onClick={() => setShowNewAddress(true)}
                        style={styles.linkBtn}
                    >
                        + Usar otra dirección
                    </button>
                </div>
            )}

            {showNewAddress && (
                <form onSubmit={handleCreateAddress} style={styles.section}>
                    <h4 style={styles.sectionTitle}>Nueva dirección</h4>
                    <input
                        placeholder="Nombre del destinatario"
                        value={newAddress.recipient_name}
                        onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <input
                        placeholder="Dirección"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <input
                        placeholder="Ciudad"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <input
                        placeholder="Departamento / Estado"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <input
                        placeholder="Código postal"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <input
                        placeholder="País"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                        style={styles.input}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {processing ? 'Guardando...' : 'Guardar dirección'}
                        </button>
                        {addresses.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowNewAddress(false)}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: '#a0a0a0',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}

            {!showNewAddress && (
                <div style={styles.actions}>
                    <button
                        onClick={onCancel}
                        style={styles.cancelBtn}
                        onMouseEnter={(e) => e.target.style.borderColor = '#666'}
                        onMouseLeave={(e) => e.target.style.borderColor = '#444'}
                    >
                        Volver al carrito
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing || !selectedAddressId || !cartId}
                        style={{
                            ...styles.confirmBtn,
                            ...((processing || !selectedAddressId || !cartId) ? styles.confirmBtnDisabled : {}),
                        }}
                    >
                        {processing ? 'Procesando...' : 'Confirmar pedido'}
                    </button>
                </div>
            )}
        </div>
    );
}