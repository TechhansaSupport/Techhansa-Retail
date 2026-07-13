import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <h2>Techhansa Retail</h2>
      </div>
      <nav>
        <ul style={{ display: 'flex', gap: '15px', listStyle: 'none' }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/partners">Partners</Link></li>
          <li><Link to="/investors">Investors</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}