import { useState, useEffect } from 'react';
import { brandsApi } from '../api/brandsApi';

export default function EditarMarca({ brandId, onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        logo_url: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (brandId) {
            cargarMarca();
        }
    }, [brandId]);

    const cargarMarca = async () => {
        try {
            const response = await brandsApi.obtener(brandId);
            setForm({
                name: response.data.name || '',
                slug: response.data.slug || '',
                logo_url: response.data.logo_url || '',
            });
        } catch (error) {
            setError('Error al cargar marca');
        }
    };

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
            await brandsApi.actualizar(brandId, form);
            if (onSuccess) onSuccess();
            alert('Marca actualizada exitosamente!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar marca');
        }
        setLoading(false);
    };

    if (!brandId) {
        return <p>Selecciona una marca para editar</p>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Editar Marca</h3>
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
                placeholder="Slug"
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
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Actualizando...' : 'Actualizar Marca'}
            </button>
        </form>
    );
}