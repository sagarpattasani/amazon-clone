import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import './ProductList.css';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '0');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 20, sort };
    if (q) params.q = q;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productAPI.getProducts(params).then(res => {
      const data = res.data.data;
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setLoading(false);
    }).catch(() => setLoading(false));

    productAPI.getBrands(category || null).then(res => {
      setBrands(res.data.data || []);
    }).catch(() => {});
  }, [q, category, brand, sort, page, minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '0');
    setSearchParams(params);
  };

  return (
    <div className="product-list-page">
      {/* Sidebar Filters */}
      <aside className="filters-sidebar">
        <h3 className="filters-title">Filters</h3>

        <div className="filter-group">
          <h4>Sort By</h4>
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
            { value: 'rating', label: 'Customer Rating' },
            { value: 'popularity', label: 'Popularity' },
            { value: 'discount', label: 'Discount' },
          ].map(opt => (
            <label key={opt.value} className="filter-radio">
              <input type="radio" name="sort" checked={sort === opt.value}
                onChange={() => updateFilter('sort', opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>

        {brands.length > 0 && (
          <div className="filter-group">
            <h4>Brand</h4>
            {brands.slice(0, 15).map(b => (
              <label key={b} className="filter-check">
                <input type="checkbox" checked={brand === b}
                  onChange={() => updateFilter('brand', brand === b ? '' : b)} />
                {b}
              </label>
            ))}
          </div>
        )}

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-range-inputs">
            <input type="number" placeholder="Min" value={minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)} />
            <span>to</span>
            <input type="number" placeholder="Max" value={maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)} />
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="products-main">
        <Breadcrumb items={[
          q ? { label: `Search: "${q}"` } :
          category ? { label: 'Products', path: '/products' } :
          { label: 'All Products' },
          ...(category ? [{ label: `Category ${category}` }] : []),
        ]} />
        <div className="results-header">
          <p>{q ? `Results for "${q}"` : 'All Products'} — <strong>{totalElements}</strong> results</p>
        </div>

        {loading ? (
          <div className="loading-spinner" />
        ) : products.length === 0 ? (
          <div className="no-results">
            <p style={{ fontSize: 48 }}>🔍</p>
            <h3>No results found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 0} className="btn btn-secondary"
                  onClick={() => updateFilter('page', String(page - 1))}>← Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button disabled={page >= totalPages - 1} className="btn btn-secondary"
                  onClick={() => updateFilter('page', String(page + 1))}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
