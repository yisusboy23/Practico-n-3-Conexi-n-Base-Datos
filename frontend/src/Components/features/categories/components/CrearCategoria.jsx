import { useState, useEffect } from 'react';
import { categoriesApi } from '../api/categoriesApi';

const styles = {
    container: {
        maxWidth: '500px',
        margin: '20px 0',
        padding: '25px',
        backgroundColor: '#121212',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        color: '#e0e0e0',
    },
    title: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1.4rem',
        color: '#fff',
        borderBottom: '2px solid #7b2ffc',
        paddingBottom: '10px',
        display: 'inline-block',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '8px 0 15px 0',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px',
        margin: '8px 0 15px 0',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
    },
    error: {
        color: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ff4d4d',
    },
    button: {
        padding: '12px 25px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '5px',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    }
};

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
        <form onSubmit={handleSubmit} style={styles.container}>
            <h3 style={styles.title}>Crear Categoría</h3>
            {error && <div style={styles.error}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={form.name}
                onChange={handleNameChange}
                required
                style={styles.input}
            />
            
            <input
                type="text"
                placeholder="Slug (se genera automáticamente)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                style={styles.input}
            />
            
            <select
                value={form.parent_id}
                onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                style={styles.select}
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
                style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : {}),
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
            >
                {loading ? 'Creando...' : 'Crear Categoría'}
            </button>
        </form>
    );
}