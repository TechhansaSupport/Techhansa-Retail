import Hero from '../Component/Home/hero';

// Defining the data directly in the file
const featuredProducts = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 299.99, category: "Electronics", inStock: true },
  { id: 2, name: "Minimalist Leather Backpack", price: 120.00, category: "Accessories", inStock: true },
  { id: 3, name: "Smart Fitness Watch", price: 199.50, category: "Wearables", inStock: false },
  { id: 4, name: "Mechanical Keyboard", price: 145.00, category: "Electronics", inStock: true }
];

export default function Homepage() {
  return (
    <div className="page-container">
      <Hero />
      
      {/* <section className="products-section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <span style={{ color: product.inStock ? 'green' : 'red' }}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}