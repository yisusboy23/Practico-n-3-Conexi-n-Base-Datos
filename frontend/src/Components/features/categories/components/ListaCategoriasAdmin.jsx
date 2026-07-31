import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import { categoriesApi } from '../api/categoriesApi';
import CrearCategoria from './CrearCategoria';
import EditarCategoria from './EditarCategoria';

const styles = {
    container: {
        color: '#e0e0e0',
        marginTop: '10px',
    },
    toolbar: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    createBtn: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: '0.3s',
    },
    searchInput: {
        flex: 1,
        padding: '10px 15px',
        backgroundColor: '#151515',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '16px',
        outline: 'none',
        minWidth: '200px',
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
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#151515',
        border: '1px solid #2a2a2a',
        padding: '20px',
        borderRadius: '12px',
        transition: 'all 0.2s',
    },
    cardTitle: {
        color: '#fff',
        margin: '0 0 8px 0',
        fontSize: '1.2rem',
    },
    cardText: {
        color: '#a0a0a0',
        margin: '5px 0',
        fontSize: '0.9rem',
    },
    cardActions: {
        display: 'flex',
        gap: '8px',
        marginTop: '15px',
    },
    editBtn: {
        padding: '6px 14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: '0.2s',
    },
    deleteBtn: {
        padding: '6px 14px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: '0.2s',
    },
    emptyMsg: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
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

export default function ListaCategoriasAdmin() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { categories, loading, error, refetch, pagination } = useCategories({ 
        page,
        search: searchTerm 
    });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // Búsqueda con debounce (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1); // Resetear a página 1 al buscar
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar esta categoría?')) {
            try {
                await categoriesApi.eliminar(id);
                alert('Categoría eliminada!');
                refetch();
            } catch (error) {
                alert('Error al eliminar categoría');
            }
        }
    };

    if (loading) return <p style={{color: '#a0a0a0'}}>Cargando categorías...</p>;
    if (error) return <p style={{color: '#ff4d4d'}}>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div style={styles.container}>
            {/* BARRA DE BÚSQUEDA Y BOTÓN CREAR */}
            <div style={styles.toolbar}>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    style={styles.createBtn}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                    {showCreate ? 'Cancelar' : '+ Crear Categoría'}
                </button>

                <input
                    type="text"
                    placeholder="🔍 Buscar categorías por nombre..."
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

            {showCreate && <CrearCategoria onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedCategory && (
                <EditarCategoria
                    categoryId={selectedCategory.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedCategory(null); }}
                />
            )}

            {/* CONTADOR DE RESULTADOS */}
            {pagination?.total !== undefined && (
                <p style={styles.counter}>
                    {pagination.total} categorías encontradas
                </p>
            )}

            {/* LISTA DE CATEGORÍAS */}
            <div style={styles.grid}>
                {categories.map((category) => (
                    <div key={category.id} style={styles.card}>
                        <h4 style={styles.cardTitle}>{category.name}</h4>
                        <p style={styles.cardText}><strong>Slug:</strong> {category.slug}</p>
                        <p style={styles.cardText}><strong>Ruta:</strong> {category.full_path || 'N/A'}</p>
                        <div style={styles.cardActions}>
                            <button
                                onClick={() => { setSelectedCategory(category); setShowEdit(true); }}
                                style={styles.editBtn}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#0069d9'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                style={styles.deleteBtn}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
                        {pagination?.total && (
                            <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                                ({pagination.total} categorías)
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