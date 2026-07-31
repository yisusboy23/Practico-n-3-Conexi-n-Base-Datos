import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categoriesApi';

export default function CrearCategoria({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        slug: '',
        parent_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar categorías para el selector
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const response = await categoriesApi.listar();
            setCategories(response.data.data || []);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    };

    // Generar slug automáticamente desde el nombre
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
            await categoriesApi.crear(form);
            if (onSuccess) onSuccess();
            setForm({ name: '', slug: '', parent_id: '' });
            alert('Categoría creada exitosamente!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear categoría');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Crear Categoría</h3>
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
                placeholder="Slug (se genera automáticamente)"
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
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Creando...' : 'Crear Categoría'}
            </button>
        </form>
    );
}