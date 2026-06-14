const baseUrl = process.env.API_URL || 'http://localhost:5001';

function fail(message) {
  console.error('FAIL:', message);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchJson(path) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}: ${text}`);
  }
  return JSON.parse(text);
}

async function runTests() {
  console.log('Running pagination tests against', baseUrl);

  const page1 = await fetchJson('/api/products?page=1&limit=6');
  assert(Array.isArray(page1.products), 'Page 1 should return a products array');
  assert(page1.currentPage === 1, 'Page 1 must return currentPage 1');
  assert(page1.totalPages >= 1, 'totalPages should be at least 1');
  assert(page1.totalProducts >= page1.products.length, 'totalProducts must be >= current page length');
  assert(page1.hasPrevPage === false, 'Page 1 should have hasPrevPage false');

  const page2 = await fetchJson('/api/products?page=2&limit=6');
  assert(page2.currentPage === 2, 'Page 2 should return currentPage 2');
  assert(page2.products.length > 0, 'Page 2 should return products');
  assert(page2.hasPrevPage === true, 'Page 2 should have hasPrevPage true');

  const ids1 = new Set(page1.products.map((p) => p.id));
  const overlap = page2.products.filter((p) => ids1.has(p.id));
  assert(overlap.length === 0, 'Page 1 and page 2 should not have duplicate products');

  const lastPageNumber = page1.totalPages;
  const lastPage = await fetchJson(`/api/products?page=${lastPageNumber + 1}&limit=6`);
  assert(lastPage.currentPage === lastPageNumber, 'Requesting beyond last page should clamp to last page');
  assert(lastPage.hasNextPage === false, 'Last page should have hasNextPage false');

  const searchRes = await fetchJson('/api/products?page=1&limit=6&search=ceramic');
  const searchText = 'ceramic';
  assert(searchRes.products.every((product) => {
    const text = [product.title, product.category, product.artisanName].join(' ').toLowerCase();
    return text.includes(searchText);
  }), 'Search results should only include products matching the search term');

  const categoryRes = await fetchJson('/api/products?page=1&limit=6&category=Pottery');
  assert(categoryRes.products.every((product) => product.category === 'Pottery'), 'Category filter must return only Pottery products');
  assert(categoryRes.totalPages >= 1, 'Category-filtered result should include totalPages');

  const categories = await fetchJson('/api/products/categories');
  assert(Array.isArray(categories.categories), 'Categories endpoint should return categories array');
  assert(categories.categories.length > 0, 'Categories endpoint should return at least one category');

  console.log('All pagination tests passed successfully.');
}

runTests().catch((error) => {
  console.error('Pagination tests failed:', error.message || error);
  fail(error.stack || String(error));
});
