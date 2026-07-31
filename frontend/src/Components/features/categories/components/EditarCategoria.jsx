import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categoriesApi';

export default function EditarCategoria({ categoryId, onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        parent_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (categoryId) {
            cargarCategoria();
            cargarCategorias();
        }
    }, [categoryId]);

    const cargarCategorias = async () => {
        try {
            const response = await categoriesApi.listar();
            setCategories(response.data.data || []);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    const cargarCategoria = async () => {
        try {
            const response = await categoriesApi.obtener(categoryId);
            setForm({
                name: response.data.name || '',
                slug: response.data.slug || '',
                parent_id: response.data.parent_id || '',
            });
        } catch (error) {
            setError('Error al cargar categoría');
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
            await categoriesApi.actualizar(categoryId, form);
            if (onSuccess) onSuccess();
            alert('Categoría actualizada exitosamente!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar categoría');
        }
        setLoading(false);
    };

    if (!categoryId) {
        return <p>Selecciona una categoría para editar</p>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Editar Categoría</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre de la categoría"
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
            
            <select
                value={form.parent_id}
                onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            >
                <option value="">Sin categoría padre</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.full_path || cat.name}
                    </option>
                ))}
            </select>
            
            <button
                type="submit"
                disabled={loading}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Actualizando...' : 'Actualizar Categoría'}
            </button>
        </form>
    );
}