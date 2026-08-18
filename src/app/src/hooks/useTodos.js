import { useCallback, useEffect, useState } from 'react';
import { createTodo, fetchTodos } from '../api/todos';

function isAbortError(error) {
  return error && error.name === 'AbortError';
}

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchTodos({ signal });
      setTodos(items);
      return items;
    } catch (err) {
      if (isAbortError(err)) {
        return [];
      }
      setError(err.message || 'Failed to load todos');
      return null;
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const addTodo = useCallback(async (description) => {
    const created = await createTodo(description);
    const items = await refresh();
    if (!items) {
      setTodos((current) => {
        if (current.some((todo) => todo.id === created.id)) {
          return current;
        }
        return current.concat(created);
      });
      setError(null);
    }
    return created;
  }, [refresh]);

  return { todos, isLoading, error, refresh, addTodo };
}
