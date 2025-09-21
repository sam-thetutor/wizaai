import { useState, useEffect, useCallback } from "react";

interface UsePaginationProps<T> {
  fetchFunction: (page: number, limit: number) => Promise<T[]>;
  limit?: number;
  dependencies?: any[];
}

export const usePagination = <T>({
  fetchFunction,
  limit = 12,
  dependencies = [],
}: UsePaginationProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const newItems = await fetchFunction(pageNum, limit);

        if (reset) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        setHasMore(newItems.length === limit);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, limit, loading]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadItems(nextPage);
    }
  }, [page, loading, hasMore, loadItems]);

  const reset = useCallback(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    setError(null);
    loadItems(1, true);
  }, [loadItems]);

  useEffect(() => {
    reset();
  }, dependencies);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
  };
};
