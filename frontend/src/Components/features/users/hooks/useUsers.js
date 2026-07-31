import { useCallback, useEffect, useState } from 'react';
import { usersApi } from '../api/usersApi';

export function useUsers(filtros = {}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    const filtrosKey = JSON.stringify(filtros);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        usersApi.listar(filtros)
            .then((response) => {
                setUsers(response.data.data || []);
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
    }, [filtrosKey]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, loading, error, refetch: fetchUsers, pagination };
}