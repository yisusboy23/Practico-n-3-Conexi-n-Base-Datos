import { useCallback, useEffect, useState } from 'react';
import { categoriesApi } from '../api/categoriesApi';

export function useCategories(filtros = {}) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const fetchCategories = useCallback(() => {
        setLoading(true);
        categoriesApi.listar(filtros)
            .then((response) => {
                setCategories(response.data.data || []);
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
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, refetch: fetchCategories, pagination };
}