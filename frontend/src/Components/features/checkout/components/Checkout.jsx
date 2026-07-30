import { useEffect, useState } from 'react';
import { addressesApi } from '../../addresses/api/addressesApi';
import { checkoutApi } from '../api/checkoutApi';

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
        addressesApi.listar()
            .then((response) => {
                const mine = (response.data.data || []).filter((a) => a.user_id === user.id);
                setAddresses(mine);
                if (mine.length > 0) {
                    setSelectedAddressId(mine[0].id);
                } else {
                    setShowNewAddress(true);
                }
            })
            .catch(() => setError('Error al cargar tus direcciones'))
            .finally(() => setLoadingAddresses(false));
    }, [user.id]);

    const handleCreateAddress = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        try {
            const response = await addressesApi.crear({ ...newAddress, user_id: user.id });
            setAddresses((prev) => [...prev, response.data]);
            setSelectedAddressId(response.data.id);
            setShowNewAddress(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la dirección');
        }
        setProcessing(false);
    };

    const handleConfirm = async () => {
        if (!selectedAddressId) {
            setError('Selecciona una dirección de envío');
            return;
        }
        setProcessing(true);
        setError('');
        try {
            const response = await checkoutApi.procesar({ cart_id: cartId, address_id: selectedAddressId });
            onSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar el pedido');
        }
        setProcessing(false);
    };

    if (loadingAddresses) return <p>Cargando direcciones...</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Finalizar Compra</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {addresses.length > 0 && !showNewAddress && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>Dirección de envío</h4>
                    {addresses.map((addr) => (
                        <label
                            key={addr.id}
                            style={{ display: 'block', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={String(selectedAddressId) === String(addr.id)}
                                onChange={() => setSelectedAddressId(addr.id)}
                                style={{ marginRight: '10px' }}
                            />
                            {addr.recipient_name} — {addr.line1}, {addr.city}, {addr.state}, {addr.country}
                        </label>
                    ))}
                    <button
                        onClick={() => setShowNewAddress(true)}
                        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        + Usar otra dirección
                    </button>
                </div>
            )}

            {showNewAddress && (
                <form onSubmit={handleCreateAddress} style={{ marginBottom: '20px' }}>
                    <h4>Nueva dirección</h4>
                    <input
                        placeholder="Nombre del destinatario"
                        value={newAddress.recipient_name}
                        onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <input
                        placeholder="Dirección"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <input
                        placeholder="Ciudad"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <input
                        placeholder="Departamento / Estado"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <input
                        placeholder="Código postal"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <input
                        placeholder="País"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Guardar dirección
                    </button>
                    {addresses.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowNewAddress(false)}
                            style={{ marginLeft: '10px', padding: '10px 20px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>
            )}

            {!showNewAddress && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onCancel}
                        style={{ padding: '10px 20px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Volver al carrito
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing || !selectedAddressId}
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {processing ? 'Procesando...' : 'Confirmar pedido'}
                    </button>
                </div>
            )}
        </div>
    );
}
