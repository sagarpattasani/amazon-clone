import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';

const STORAGE_KEY = 'amazon_recently_viewed';
const MAX_ITEMS = 10;

export default function useRecentlyViewed(currentProductId) {
  const [recentProducts, setRecentProducts] = useState([]);

  // Track a product view
  const trackView = useCallback((productId) => {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = ids.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  }, []);

  // Load recently viewed products (excluding current)
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const toLoad = ids.filter((id) => id !== parseInt(currentProductId)).slice(0, 8);

    if (toLoad.length === 0) {
      setRecentProducts([]);
      return;
    }

    // Load each product (mock API returns instantly)
    Promise.allSettled(toLoad.map((id) => productAPI.getProduct(id)))
      .then((results) => {
        const products = results
          .filter((r) => r.status === 'fulfilled' && r.value.data.data)
          .map((r) => r.value.data.data);
        setRecentProducts(products);
      });
  }, [currentProductId]);

  // Auto-track when currentProductId changes
  useEffect(() => {
    if (currentProductId) trackView(parseInt(currentProductId));
  }, [currentProductId, trackView]);

  return { recentProducts, trackView };
}
