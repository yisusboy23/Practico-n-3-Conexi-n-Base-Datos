import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi';

export function useProducts(filtros = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtrar solo los parámetros que tienen valor
    const filtrosActivos = {};
    if (filtros.category_id) filtrosActivos.category_id = filtros.category_id;
    if (filtros.brand_id) filtrosActivos.brand_id = filtros.brand_id;
    if (filtros.search) filtrosActivos.search = filtros.search;

    const fetchProducts = useCallback(() => {
        setLoading(true);
        productsApi.listar(filtrosActivos)
            .then((response) => {
                setProducts(response.data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('❌ Error al cargar productos:', err);
                setError(err);
                setLoading(false);
            });
    }, [JSON.stringify(filtrosActivos)]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
}