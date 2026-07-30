import { useCallback, useEffect, useState } from 'react';
import { categoriesApi } from '../api/categoriesApi';

export function useCategories(filtros = {}) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtrosKey = JSON.stringify(filtros);

    const fetchCategories = useCallback(() => {
        setLoading(true);
        categoriesApi.listar(filtros)
            .then((response) => {
                setCategories(response.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [filtrosKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, refetch: fetchCategories };
}