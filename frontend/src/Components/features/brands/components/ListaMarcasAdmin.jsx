import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';
import { brandsApi } from '../api/brandsApi';
import CrearMarca from './CrearMarca';
import EditarMarca from './EditarMarca';

export default function ListaMarcasAdmin() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { brands, loading, error, refetch, pagination } = useBrands({ 
        page,
        search: searchTerm 
    });
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // Búsqueda con debounce (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar esta marca?')) {
            try {
                await brandsApi.eliminar(id);
                alert('Marca eliminada!');
                refetch();
            } catch (error) {
                alert('Error al eliminar marca');
            }
        }
    };

    if (loading) return <p>Cargando marcas...</p>;
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
                    {showCreate ? 'Cancelar' : '+ Crear Marca'}
                </button>

                <input
                    type="text"
                    placeholder="🔍 Buscar marcas por nombre..."
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

            {showCreate && <CrearMarca onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedBrand && (
                <EditarMarca
                    brandId={selectedBrand.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedBrand(null); }}
                />
            )}

            {/* CONTADOR DE RESULTADOS */}
            {pagination?.total !== undefined && (
                <p style={{ marginBottom: '15px', color: '#666' }}>
                    {pagination.total} marcas encontradas
                </p>
            )}

            {/* LISTA DE MARCAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {brands.map((brand) => (
                    <div key={brand.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        {brand.logo_url && (
                            <img src={brand.logo_url} alt={brand.name} style={{ maxWidth: '100px', display: 'block', margin: '0 auto 10px' }} />
                        )}
                        <h4>{brand.name}</h4>
                        <p><strong>Slug:</strong> {brand.slug}</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button
                                onClick={() => { setSelectedBrand(brand); setShowEdit(true); }}
                                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(brand.id)}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MENSAJE SIN RESULTADOS */}
            {brands.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No se encontraron marcas que coincidan con tu búsqueda
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
                                ({pagination.total} marcas)
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