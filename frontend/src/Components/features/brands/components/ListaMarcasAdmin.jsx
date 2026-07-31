import { useState } from 'react';
import { useBrands } from '../hooks/useBrands';
import { brandsApi } from '../api/brandsApi';
import CrearMarca from './CrearMarca';
import EditarMarca from './EditarMarca';

export default function ListaMarcasAdmin() {
    const { brands, loading, error, refetch } = useBrands();
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

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

    return (
        <div>
            <button
                onClick={() => setShowCreate(!showCreate)}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
            >
                {showCreate ? 'Cancelar' : '+ Crear Marca'}
            </button>

            {showCreate && <CrearMarca onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedBrand && (
                <EditarMarca
                    brandId={selectedBrand.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedBrand(null); }}
                />
            )}

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
        </div>
    );
}