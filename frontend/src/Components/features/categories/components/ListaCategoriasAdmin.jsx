import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import { categoriesApi } from '../api/categoriesApi';
import CrearCategoria from './CrearCategoria';
import EditarCategoria from './EditarCategoria';

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

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div>
            {/* BARRA DE BÚSQUEDA Y BOTÓN CREAR */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {showCreate ? 'Cancelar' : '+ Crear Categoría'}
                </button>

                <input
                    type="text"
                    placeholder="🔍 Buscar categorías por nombre..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '16px',
                        minWidth: '200px',
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

            {showCreate && <CrearCategoria onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedCategory && (
                <EditarCategoria
                    categoryId={selectedCategory.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedCategory(null); }}
                />
            )}

            {/* CONTADOR DE RESULTADOS */}
            {pagination?.total !== undefined && (
                <p style={{ marginBottom: '15px', color: '#666' }}>
                    {pagination.total} categorías encontradas
                </p>
            )}

            {/* LISTA DE CATEGORÍAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {categories.map((category) => (
                    <div key={category.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h4>{category.name}</h4>
                        <p><strong>Slug:</strong> {category.slug}</p>
                        <p><strong>Ruta:</strong> {category.full_path || 'N/A'}</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button
                                onClick={() => { setSelectedCategory(category); setShowEdit(true); }}
                                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MENSAJE SIN RESULTADOS */}
            {categories.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No se encontraron categorías que coincidan con tu búsqueda
                </p>
            )}

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', padding: '10px 0' }}>
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
                    <span style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
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