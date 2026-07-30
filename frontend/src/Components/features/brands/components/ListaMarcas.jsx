import { useBrands } from '../hooks/useBrands';

export default function ListaMarcas({ onSeleccionarMarca }) {
    const { brands, loading, error } = useBrands();

    if (loading) return <p>Cargando marcas...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
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
    );
}
