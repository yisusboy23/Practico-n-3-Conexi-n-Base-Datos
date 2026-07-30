import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi';

export function useProducts(filtros = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filtrosKey = JSON.stringify(filtros);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        productsApi.listar(filtros)
            .then((response) => {
                setProducts(response.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [filtrosKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}