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
        borderBottom: '2px solid #28a745',
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
        backgroundColor: '#28a745',
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
    toggleContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '10px',
    },
    toggleButton: {
        flex: 1,
        padding: '8px',
        backgroundColor: '#1f1f1f',
        border: '1px solid #333',
        borderRadius: '6px',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '0.85rem'
    },
    toggleActive: {
        backgroundColor: '#28a745',
        color: '#fff',
        borderColor: '#28a745',
        fontWeight: 'bold'
    }
};

// Función auxiliar para convertir el nombre a un slug válido
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Reemplaza espacios por -
        .replace(/[^\w\-]+/g, '')   // Elimina caracteres no alfanuméricos
        .replace(/\-\-+/g, '-');    // Reemplaza múltiples guiones por uno solo
};

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

    // Estados para manejo de imagen
    const [imageType, setImageType] = useState('file'); // 'file' o 'url'
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
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
        cargarDatos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Generar payload agregando el slug derivado del nombre
            const payload = {
                ...form,
                slug: slugify(form.name)
            };

            // 1. Crear el producto
            const response = await productsApi.crear(payload);
            const createdProduct = response.data.data || response.data;

            // 2. Adjuntar la imagen si fue seleccionada
            if (imageType === 'file' && selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                formData.append('is_primary', '1');
                await productsApi.subirImagen(createdProduct.id, formData);
            } else if (imageType === 'url' && imageUrl.trim() !== '') {
                await productsApi.agregarImagenUrl(createdProduct.id, {
                    url: imageUrl,
                    is_primary: true
                });
            }

            if (onSuccess) onSuccess(createdProduct);
            alert('✅ Producto e imagen creados exitosamente!');

            // Limpiar formulario y campos de imagen
            setForm({ name: '', sku: '', price: '', stock: '', category_id: '', brand_id: '', description: '' });
            setSelectedFile(null);
            setImageUrl('');

        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Error al crear producto o subir imagen');
        } finally {
            setLoading(false);
        }
    };

    if (cargandoDatos) return <p style={{ color: '#a0a0a0' }}>Cargando categorías y marcas...</p>;

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h3 style={styles.title}>Crear Producto</h3>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    style={styles.field}
                />
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Categoría</label>
                <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
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

            {/* SECCIÓN IMAGEN DEL PRODUCTO */}
            <div style={styles.inputGroup}>
                <label style={styles.label}>Imagen del Producto</label>
                
                <div style={styles.toggleContainer}>
                    <button
                        type="button"
                        style={{ ...styles.toggleButton, ...(imageType === 'file' ? styles.toggleActive : {}) }}
                        onClick={() => setImageType('file')}
                    >
                        Subir Archivo
                    </button>
                    <button
                        type="button"
                        style={{ ...styles.toggleButton, ...(imageType === 'url' ? styles.toggleActive : {}) }}
                        onClick={() => setImageType('url')}
                    >
                        URL Externa
                    </button>
                </div>

                {imageType === 'file' ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        style={{ ...styles.field, padding: '8px' }}
                    />
                ) : (
                    <input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={styles.field}
                    />
                )}
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                    placeholder="Descripción del producto"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
            >
                {loading ? 'Creando...' : 'Crear Producto'}
            </button>
        </form>
    );
}