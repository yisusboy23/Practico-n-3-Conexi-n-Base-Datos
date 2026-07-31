import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

const API_BASE_URL = 'http://localhost:8000'; // Cambia el puerto si tu backend corre en otro

const styles = {
    container: {
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        padding: '10px 0',
    },
    searchWrapper: {
        display: 'flex',
        gap: '10px',
        marginBottom: '25px',
    },
    searchInput: {
        flex: 1,
        padding: '12px 16px',
        backgroundColor: '#151515',
        border: '1px solid #333',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '16px',
        outline: 'none',
    },
    clearBtn: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    counter: {
        marginBottom: '20px',
        color: '#a0a0a0',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: '#151515',
        border: '1px solid #2a2a2a',
        padding: '20px',
        borderRadius: '12px',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
    },
    imageContainer: {
        width: '100%',
        height: '180px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '15px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #282828',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    noImageText: {
        color: '#666',
        fontSize: '0.85rem',
        fontWeight: '500',
    },
    cardTitle: {
        color: '#fff',
        margin: '0 0 10px 0',
        fontSize: '1.2rem',
    },
    cardDetail: {
        color: '#a0a0a0',
        margin: '6px 0',
        fontSize: '0.95rem',
    },
    addBtn: {
        marginTop: '15px',
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.2s',
        color: 'white',
    },
    emptyMsg: {
        textAlign: 'center',
        padding: '50px 20px',
        color: '#666',
        fontSize: '1.1rem',
    },
    pagination: {
        display: 'flex',
        justify: 'center',
        gap: '10px',
        marginTop: '35px',
        padding: '10px 0',
    },
    pageBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    pageBtnActive: {
        backgroundColor: '#7b2ffc',
        color: 'white',
    },
    pageBtnDisabled: {
        backgroundColor: '#2a2a2a',
        color: '#666',
        cursor: 'not-allowed',
    },
    pageInfo: {
        padding: '8px 16px',
        backgroundColor: '#151515',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        color: '#a0a0a0',
    }
};

export default function ListaProductos({ onSeleccionarProducto, onAddToCart, filtros = {} }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { products, loading, error, pagination } = useProducts({ 
        ...filtros, 
        page,
        search: searchTerm 
    });
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    if (loading) return <p style={{color: '#a0a0a0', textAlign: 'center'}}>Cargando productos...</p>;
    if (error) return <p style={{color: '#ff4d4d', textAlign: 'center'}}>Error: {error.message}</p>;

    const handleAdd = async (product) => {
        if (!onAddToCart) return;
        setAddingId(product.id);
        await onAddToCart(product);
        setAddingId(null);
    };

    // Helper para formatear la URL de la imagen recibida
    const getProductImageUrl = (product) => {
        const rawUrl = product.primary_image || product.image_url || product.image || product.images?.[0]?.url;
        if (!rawUrl) return null;
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
        return `${API_BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    };

    const totalPages = pagination?.last_page || 1;

    return (
        <div style={styles.container}>
            <div style={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="🔍 Buscar productos por nombre..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={styles.searchInput}
                />
                {searchInput && (
                    <button
                        onClick={() => {
                            setSearchInput('');
                            setSearchTerm('');
                            setPage(1);
                        }}
                        style={styles.clearBtn}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                        ✕ Limpiar
                    </button>
                )}
            </div>

            {pagination?.total !== undefined && (
                <p style={styles.counter}>
                    {pagination.total} productos encontrados
                </p>
            )}

            <div style={styles.grid}>
                {products.map((product) => {
                    const imageUrl = getProductImageUrl(product);

                    return (
                        <div
                            key={product.id}
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#7b2ffc';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#2a2a2a';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div
                                onClick={() => onSeleccionarProducto?.(product)}
                                style={{ cursor: onSeleccionarProducto ? 'pointer' : 'default' }}
                            >
                                {/* RENDERIZADO DE LA IMAGEN CON FALLBACK */}
                                <div style={styles.imageContainer}>
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            style={styles.cardImage}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.parentNode) {
                                                    e.currentTarget.parentNode.innerHTML = `<span style="color:#666;font-size:0.85rem;">Imagen no disponible</span>`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <span style={styles.noImageText}>Sin imagen disponible</span>
                                    )}
                                </div>

                                <h3 style={styles.cardTitle}>{product.name}</h3>
                                <p style={styles.cardDetail}><strong>Precio:</strong> ${product.price}</p>
                                <p style={styles.cardDetail}><strong>Stock:</strong> {product.stock}</p>
                                <p style={styles.cardDetail}><strong>Marca:</strong> {product.brand?.name || 'N/A'}</p>
                                <p style={styles.cardDetail}><strong>Categoría:</strong> {product.category?.name || 'N/A'}</p>
                            </div>

                            {onAddToCart && (
                                <button
                                    onClick={() => handleAdd(product)}
                                    disabled={addingId === product.id || product.stock < 1}
                                    style={{
                                        ...styles.addBtn,
                                        backgroundColor: product.stock < 1 ? '#444' : '#007bff',
                                        cursor: product.stock < 1 || addingId === product.id ? 'not-allowed' : 'pointer',
                                    }}
                                    onMouseEnter={(e) => !(product.stock < 1) && !(addingId === product.id) && (e.target.style.backgroundColor = '#0056b3')}
                                    onMouseLeave={(e) => !(product.stock < 1) && !(addingId === product.id) && (e.target.style.backgroundColor = '#007bff')}
                                >
                                    {product.stock < 1
                                        ? 'Sin stock'
                                        : addingId === product.id
                                            ? 'Agregando...'
                                            : 'Agregar al carrito'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && !loading && (
                <p style={styles.emptyMsg}>
                    No se encontraron productos que coincidan con tu búsqueda
                </p>
            )}

            {totalPages > 1 && (
                <div style={styles.pagination}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{
                            ...styles.pageBtn,
                            ...(page <= 1 ? styles.pageBtnDisabled : styles.pageBtnActive),
                        }}
                    >
                        Anterior
                    </button>
                    <span style={styles.pageInfo}>
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
                            ...styles.pageBtn,
                            ...(page >= totalPages ? styles.pageBtnDisabled : styles.pageBtnActive),
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}