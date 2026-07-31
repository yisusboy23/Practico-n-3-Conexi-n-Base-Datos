import { useCallback, useEffect, useState } from 'react';
import { brandsApi } from '../api/brandsApi';

export function useBrands(filtros = {}) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchBrands = useCallback(() => {
        setLoading(true);
        brandsApi.listar(filtros)
            .then((response) => {
                setBrands(response.data.data || []);
                setPagination({
                    current_page: response.data.current_page || 1,
                    last_page: response.data.last_page || 1,
                    per_page: response.data.per_page || 15,
                    total: response.data.total || 0,
                });
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [JSON.stringify(filtros)]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return { brands, loading, error, refetch: fetchBrands, pagination };
}