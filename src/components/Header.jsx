import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Início' },
  { to: '/conteudos', label: 'Informações jurídicas' },
  { to: '/advogados', label: 'Advogados' },
  { to: '/servicos', label: 'Órgãos e serviços' },
  { to: '/estagios', label: 'Estágios' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/sobre', label: 'Sobre' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">GT</span>
          <span>
            <strong>Gran Tietê</strong>
            <small>Universidade e Sociedade</small>
          </span>
        </Link>

        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
          ☰
        </button>

        <nav className={open ? 'main-nav open' : 'main-nav'}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <Link className="admin-link" to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
