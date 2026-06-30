import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = searchParams.get('page') || '1';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    axios.get('/api/products', { params: { keyword, category, sort, minPrice, maxPrice, page, limit: 12 } })
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container products-page">
      <div className="products-header">
        <div>
          <h1>{category || (keyword ? `Results for "${keyword}"` : 'All Products')}</h1>
          <p>{data.total} product{data.total !== 1 ? 's' : ''} found</p>
        </div>
        <button className="filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
          ⚙️ Filters
        </button>
      </div>

      <div className="products-layout">
        <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h4>Category</h4>
            <button className={`filter-option ${!category ? 'active' : ''}`} onClick={() => updateParam('category', '')}>All</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-option ${category === c ? 'active' : ''}`} onClick={() => updateParam('category', c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price range</h4>
            <div className="price-inputs">
              <input
                type="number" placeholder="Min" value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="form-input"
              />
              <span>–</span>
              <input
                type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button className="btn btn-ghost" onClick={() => setSearchParams({})}>Clear all filters</button>
        </aside>

        <div className="products-main">
          <div className="sort-bar">
            <select className="form-input sort-select" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : data.products.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {data.products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {data.pages > 1 && (
                <div className="pagination">
                  <button disabled={data.page <= 1} onClick={() => goToPage(data.page - 1)}>← Prev</button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={data.page === p ? 'active' : ''} onClick={() => goToPage(p)}>{p}</button>
                  ))}
                  <button disabled={data.page >= data.pages} onClick={() => goToPage(data.page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
