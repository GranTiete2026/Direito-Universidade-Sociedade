import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { adminMenu } from './adminConfig';

const tables = [
  { key: 'legal_contents', label: 'Conteúdos' },
  { key: 'lawyers', label: 'Advogados' },
  { key: 'internships', label: 'Estágios' },
  { key: 'events', label: 'Eventos' },
  { key: 'contact_messages', label: 'Mensagens' }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const results = await Promise.all(tables.map((table) => supabase.from(table.key).select('id', { count: 'exact', head: true })));
        const nextStats = {};
        results.forEach((result, index) => {
          if (result.error) throw result.error;
          nextStats[tables[index].key] = result.count ?? 0;
        });
        setStats(nextStats);
      } catch (err) {
        setError(err.message);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Área administrativa</span>
          <h1>Painel geral</h1>
          <p>Gerencie os dados públicos da plataforma sem editar código.</p>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="stats-grid">
        {tables.map((table) => (
          <div className="stat-card" key={table.key}>
            <strong>{stats[table.key] ?? '-'}</strong>
            <span>{table.label}</span>
          </div>
        ))}
      </div>
      <div className="admin-shortcuts card-grid">
        {adminMenu.filter((item) => item.to !== '/admin').map((item) => (
          <Link className="card shortcut-card" key={item.to} to={item.to}>
            <span>{item.icon}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
