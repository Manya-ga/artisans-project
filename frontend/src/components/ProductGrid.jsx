// ProductGrid.jsx
// Responsive grid layout for showcasing multiple products using the shared ProductCard component.
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, isOwner, onProductDeleted, onClick }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 bg-white/50 rounded-[40px] border border-dashed border-gray-200">
        No products found in this collection.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id || product._id || index} 
          product={product} 
          isOwner={isOwner}
          onProductDeleted={onProductDeleted}
          onClick={onClick}
        />
      ))}
    </div>
  );
}


