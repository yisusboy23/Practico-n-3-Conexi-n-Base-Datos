import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';

const styles = {
    container: {
        backgroundColor: '#0a0a0a',
        color: '#e0e0e0',
        padding: '10px 0',
    },
    searchWrapper: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
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
        transition: 'border-color 0.2s',
    },
    clearBtn: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: '0.2s',
    },
    counter: {
        marginBottom: '15px',
        color: '#a0a0a0',
        fontSize: '0.95rem',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '15px',
    },
    listItem: {
        padding: '15px',
        backgroundColor: '#151515',
        border: '1px solid #2a2a2a',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: '#e0e0e0',
    },
    categoryName: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '5px',
    },
    categoryPath: {
        color: '#7b2ffc',
        fontSize: '0.85rem',
    },
    emptyMsg: {
        textAlign: 'center',
        padding: '50px 20px',
        color: '#666',
        fontSize: '1.1rem',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '30px',
        padding: '10px 0',
    },
    pageBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: '0.2s',
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

export default function ListaCategorias({ onSeleccionarCategoria }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { categories, loading, error, pagination } = useCategories({ 
        page,
        search: searchTerm 
    });

    // Búsqueda con debounce (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    if (loading) return <p style={{color: '#a0a0a0', textAlign: 'center'}}>Cargando categorías...</p>;
    if (error) return <p style={{color: '#ff4d4d', textAlign: 'center'}}>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div style={styles.container}>
            {/* BARRA DE BÚSQUEDA */}
            <div style={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="🔍 Buscar categorías..."
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

            {/* CONTADOR DE RESULTADOS */}
            {pagination?.total !== undefined && (
                <p style={styles.counter}>
                    {pagination.total} categorías encontradas
                </p>
            )}

            {/* LISTA DE CATEGORÍAS */}
            <ul style={styles.list}>
                {categories.map((category) => (
                    <li 
                        key={category.id} 
                        onClick={() => onSeleccionarCategoria(category)}
                        style={styles.listItem}
                        onMouseEnter={(e) => {e.target.style.borderColor = '#7b2ffc'; e.target.style.transform = 'translateY(-3px)';}}
                        onMouseLeave={(e) => {e.target.style.borderColor = '#2a2a2a'; e.target.style.transform = 'translateY(0)';}}
                    >
                        <div style={styles.categoryName}>{category.name}</div>
                        {category.full_path && <div style={styles.categoryPath}>{category.full_path}</div>}
                    </li>
                ))}
            </ul>

            {/* MENSAJE SIN RESULTADOS */}
            {categories.length === 0 && !loading && (
                <p style={styles.emptyMsg}>
                    No se encontraron categorías que coincidan con tu búsqueda
                </p>
            )}

            {/* PAGINACIÓN */}
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