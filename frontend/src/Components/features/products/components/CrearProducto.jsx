import { useState } from 'react';
import { productsApi } from '../api/productsApi';

export default function CrearProducto({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await productsApi.crear(form);
            if (onSuccess) onSuccess(response.data);
            alert('Producto creado exitosamente!');
            setForm({ name: '', sku: '', price: '', stock: '', category_id: '', brand_id: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear producto');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Crear Producto</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <input type="number" name="price" placeholder="Precio" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <input type="number" name="category_id" placeholder="ID Categoría" value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <input type="number" name="brand_id" placeholder="ID Marca" value={form.brand_id} onChange={(e) => setForm({...form, brand_id: e.target.value})} required style={{ width: '100%', padding: '8px', margin: '5px 0' }} />
            <textarea name="description" placeholder="Descripción" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: '8px', margin: '5px 0', minHeight: '80px' }} />
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{loading ? 'Creando...' : 'Crear Producto'}</button>
        </form>
    );
}
