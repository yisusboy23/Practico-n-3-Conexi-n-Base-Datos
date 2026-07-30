import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function ListaProductos({ onSeleccionarProducto, onAddToCart }) {
    const { products, loading, error } = useProducts();
    const [addingId, setAddingId] = useState(null);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleAdd = async (product) => {
        if (!onAddToCart) return;
        setAddingId(product.id);
        await onAddToCart(product);
        setAddingId(null);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {products.map((product) => (
                <div
                    key={product.id}
                    style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}
                >
                    <div
                        onClick={() => onSeleccionarProducto?.(product)}
                        style={{ cursor: onSeleccionarProducto ? 'pointer' : 'default' }}
                    >
                        <h3>{product.name}</h3>
                        <p><strong>Precio:</strong> ${product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Marca:</strong> {product.brand?.name || 'N/A'}</p>
                        <p><strong>Categoría:</strong> {product.category?.name || 'N/A'}</p>
                    </div>
                    {onAddToCart && (
                        <button
                            onClick={() => handleAdd(product)}
                            disabled={addingId === product.id || product.stock < 1}
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                padding: '8px',
                                backgroundColor: product.stock < 1 ? '#aaa' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: product.stock < 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {product.stock < 1
                                ? 'Sin stock'
                                : addingId === product.id
                                    ? 'Agregando...'
                                    : 'Agregar al carrito'}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
