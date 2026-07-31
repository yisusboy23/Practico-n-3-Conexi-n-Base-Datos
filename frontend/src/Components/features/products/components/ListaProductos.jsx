import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function ListaProductos({ onSeleccionarProducto, onAddToCart, filtros = {} }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { products, loading, error, pagination, refetch } = useProducts({ 
        ...filtros, 
        page,
        search: searchTerm 
    });
    const [addingId, setAddingId] = useState(null);

    // Buscar cuando el usuario escribe (con debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Resetear a página 1 al buscar
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleAdd = async (product) => {
        if (!onAddToCart) return;
        setAddingId(product.id);
        await onAddToCart(product);
        setAddingId(null);
    };

    const totalPages = pagination?.last_page || 1;

    return (
        <div>
            {/* BARRA DE BÚSQUEDA */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="🔍 Buscar productos por nombre..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                    }}
                />
                {searchInput && (
                    <button
                        onClick={() => {
                            setSearchInput('');
                            setSearchTerm('');
                            setPage(1);
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        ✕ Limpiar
                    </button>
                )}
            </div>

            {/* CONTADOR DE RESULTADOS */}
            {pagination?.total !== undefined && (
                <p style={{ marginBottom: '15px', color: '#666' }}>
                    {pagination.total} productos encontrados
                </p>
            )}

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

            {products.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No se encontraron productos que coincidan con tu búsqueda
                </p>
            )}

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '10px', 
                    marginTop: '30px', 
                    padding: '10px 0' 
                }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: page <= 1 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: page <= 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Anterior
                    </button>
                    <span style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Página {page} de {totalPages} 
                        {pagination?.total && (
                            <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                                ({pagination.total} productos)
                            </span>
                        )}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: page >= totalPages ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}