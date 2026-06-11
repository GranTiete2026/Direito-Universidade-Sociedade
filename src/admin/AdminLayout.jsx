import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { adminMenu } from './adminConfig';

export default function AdminLayout({ children, profile }) {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" to="/admin">
          <span className="brand-mark">GT</span>
          <span><strong>Admin</strong><small>{profile?.name || 'Gran Tietê'}</small></span>
        </Link>
        <nav className="admin-menu">
          {adminMenu.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <button className="button ghost full" onClick={signOut}>Sair</button>
        <Link className="button secondary full" to="/">Ver site</Link>
      </aside>
      <section className="admin-main">
        {children}
      </section>
    </div>
  );
}
