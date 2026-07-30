import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../api/productsApi';
import CrearProducto from './CrearProducto';
import EditarProducto from './EditarProducto';

export default function ListaProductosAdmin() {
    const { products, loading, error, refetch } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
            try {
                await productsApi.eliminar(id);
                alert('Producto eliminado!');
                refetch();
            } catch (error) {
                alert('Error al eliminar producto');
            }
        }
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button onClick={() => setShowCreate(!showCreate)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
                {showCreate ? 'Cancelar' : '+ Crear Producto'}
            </button>

            {showCreate && <CrearProducto onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedProduct && (
                <EditarProducto 
                    productId={selectedProduct.id} 
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedProduct(null); }} 
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h4>{product.name}</h4>
                        <p><strong>Precio:</strong> </p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button onClick={() => { setSelectedProduct(product); setShowEdit(true); }} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
