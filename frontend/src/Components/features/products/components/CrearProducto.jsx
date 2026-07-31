import { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { brandsApi } from '../../brands/api/brandsApi';

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
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    // Cargar categorías y marcas al montar el componente
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
            const response = await productsApi.crear(form);
            if (onSuccess) onSuccess(response.data);
            alert('✅ Producto creado exitosamente!');
            setForm({ name: '', sku: '', price: '', stock: '', category_id: '', brand_id: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear producto');
        }
        setLoading(false);
    };

    if (cargandoDatos) {
        return <p>Cargando categorías y marcas...</p>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Crear Producto</h3>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>SKU</label>
                <input
                    type="text"
                    placeholder="Código SKU"
                    value={form.sku}
                    onChange={(e) => setForm({...form, sku: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Precio</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Stock</label>
                <input
                    type="number"
                    placeholder="Cantidad en stock"
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoría</label>
                <select
                    value={form.category_id}
                    onChange={(e) => setForm({...form, category_id: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Marca</label>
                <select
                    value={form.brand_id}
                    onChange={(e) => setForm({...form, brand_id: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                            {marca.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Descripción</label>
                <textarea
                    placeholder="Descripción del producto"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{ 
                    width: '100%', 
                    padding: '10px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: loading ? 'not-allowed' : 'pointer' 
                }}
            >
                {loading ? 'Creando...' : 'Crear Producto'}
            </button>
        </form>
    );
}