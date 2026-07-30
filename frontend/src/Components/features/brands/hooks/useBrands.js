import { useCallback, useEffect, useState } from 'react';
import { brandsApi } from '../api/brandsApi';

export function useBrands(filtros = {}) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtrosKey = JSON.stringify(filtros);

    const fetchBrands = useCallback(() => {
        setLoading(true);
        brandsApi.listar(filtros)
            .then((response) => {
                setBrands(response.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [filtrosKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return { brands, loading, error, refetch: fetchBrands };
}