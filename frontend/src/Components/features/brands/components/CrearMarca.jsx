import { useState } from 'react';
import { brandsApi } from '../api/brandsApi';

export default function CrearMarca({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        logo_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generarSlug = (nombre) => {
        return nombre
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setForm({
            ...form,
            name,
            slug: generarSlug(name),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await brandsApi.crear(form);
            if (onSuccess) onSuccess();
            setForm({ name: '', slug: '', logo_url: '' });
            alert('Marca creada exitosamente!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear marca');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Crear Marca</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre de la marca"
                value={form.name}
                onChange={handleNameChange}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <input
                type="text"
                placeholder="Slug (se genera automáticamente)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <input
                type="url"
                placeholder="URL del logo (opcional)"
                value={form.logo_url}
                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <button
                type="submit"
                disabled={loading}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Creando...' : 'Crear Marca'}
            </button>
        </form>
    );
}