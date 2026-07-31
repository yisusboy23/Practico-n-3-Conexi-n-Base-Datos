import { useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';

export function useCart(cartId) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!cartId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await cartApi.obtener(cartId);
            // 🔴 EL PROBLEMA ESTÁ AQUÍ: response.data contiene {data: {...}}
            // Tenemos que acceder a response.data.data
            const cartData = response.data.data || response.data;
            console.log('🛒 fetchCart - datos:', cartData);
            setCart(cartData);
            setError(null);
        } catch (error) {
            console.error('🛒 Error al cargar carrito:', error);
            setError(error.response?.data?.message || 'Error al cargar el carrito');
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (productId, quantity) => {
        try {
            const response = await cartApi.addItem(cartId, { product_id: productId, quantity });
            const cartData = response.data.data || response.data;
            setCart(cartData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clear(cartId);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    useEffect(() => {
        fetchCart();
    }, [cartId]);

    return { cart, loading, error, addItem, clearCart, refetch: fetchCart };
}