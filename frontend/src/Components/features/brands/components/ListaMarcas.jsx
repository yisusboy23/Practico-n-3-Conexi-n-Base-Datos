import { useState, useEffect } from 'react';
import { useBrands } from '../hooks/useBrands';

export default function ListaMarcas({ onSeleccionarMarca }) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { brands, loading, error, pagination } = useBrands({ 
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

    if (loading) return <p>Cargando marcas...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div>
            {/* BARRA DE BÚSQUEDA */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Buscar marcas..."
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
                    {pagination.total} marcas encontradas
                </p>
            )}

            {/* LISTA DE MARCAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {brands.map((brand) => (
                    <div 
                        key={brand.id} 
                        onClick={() => onSeleccionarMarca(brand)}
                        style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}
                    >
                        {brand.logo_url && <img src={brand.logo_url} alt={brand.name} style={{ maxWidth: '100px' }} />}
                        <h4>{brand.name}</h4>
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