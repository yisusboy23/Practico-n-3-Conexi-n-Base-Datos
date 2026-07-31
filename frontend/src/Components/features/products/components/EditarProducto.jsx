import { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { brandsApi } from '../../brands/api/brandsApi';

const styles = {
    container: {
        maxWidth: '550px',
        margin: '20px 0',
        padding: '30px',
        backgroundColor: '#141414',
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
        borderBottom: '2px solid #007bff',
        paddingBottom: '12px',
        display: 'inline-block',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        marginBottom: '6px',
        color: '#a0a0a0',
        fontSize: '0.9rem',
    },
    field: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    error: {
        color: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ff4d4d',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '5px',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    message: {
        color: '#a0a0a0',
        padding: '20px',
        textAlign: 'center',
    }
};

export default function EditarProducto({ productId, onSuccess }) {
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
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargandoDatos(true);
                const [categoriasRes, marcasRes] = await Promise.all([
                    categoriesApi.listar(),
                    brandsApi.listar()
                ]);
                setCategorias(categoriasRes.data.data || []);
                setMarcas(marcasRes.data.data || []);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar categorías y marcas');
            } finally {
                setCargandoDatos(false);
            }
        };
        
        if (productId) {
            cargarDatos();
            cargarProducto();
        }
    }, [productId]);

    const cargarProducto = async () => {
        try {
            const response = await productsApi.obtener(productId);
            const productData = response.data.data || response.data;
            setForm({
                name: productData.name || '',
                sku: productData.sku || '',
                price: productData.price || '',
                stock: productData.stock || '',
                category_id: productData.category_id || '',
                brand_id: productData.brand_id || '',
                description: productData.description || '',
            });
        } catch (error) {
            console.error('Error al cargar producto:', error);
            setError('Error al cargar producto');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await productsApi.actualizar(productId, form);
            if (onSuccess) onSuccess(response.data);
            alert('✅ Producto actualizado exitosamente!');
        } catch (err) {
            console.error('Error al actualizar:', err);
            setError(err.response?.data?.message || 'Error al actualizar producto');
        }
        setLoading(false);
    };

    if (!productId) return <p style={styles.message}>Selecciona un producto para editar</p>;
    if (cargandoDatos) return <p style={styles.message}>Cargando categorías y marcas...</p>;

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h3 style={styles.title}>Editar Producto</h3>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    style={styles.field}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>SKU</label>
                <input
                    type="text"
                    placeholder="Código SKU"
                    value={form.sku}
                    onChange={(e) => setForm({...form, sku: e.target.value})}
                    required
                    style={styles.field}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Precio</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    required
                    style={styles.field}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Stock</label>
                <input
                    type="number"
                    placeholder="Cantidad en stock"
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: e.target.value})}
                    required
                    style={styles.field}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Categoría</label>
                <select
                    value={form.category_id}
                    onChange={(e) => setForm({...form, category_id: e.target.value})}
                    required
                    style={styles.field}
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Marca</label>
                <select
                    value={form.brand_id}
                    onChange={(e) => setForm({...form, brand_id: e.target.value})}
                    required
                    style={styles.field}
                >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                            {marca.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                    placeholder="Descripción del producto"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    style={{ ...styles.field, minHeight: '80px', resize: 'vertical' }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    ...styles.button,
                    ...(loading ? styles.buttonDisabled : {}),
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0069d9')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
            >
                {loading ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
        </form>
    );
}