import { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import { brandsApi } from '../../brands/api/brandsApi';

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

    // Cargar categorías, marcas y el producto
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargandoDatos(true);
                // Cargar todo en paralelo
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
            // Extraer los datos correctamente
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

    if (!productId) {
        return <p>Selecciona un producto para editar</p>;
    }

    if (cargandoDatos) {
        return <p>Cargando categorías y marcas...</p>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Editar Producto</h3>
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
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: loading ? 'not-allowed' : 'pointer' 
                }}
            >
                {loading ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
        </form>
    );
}