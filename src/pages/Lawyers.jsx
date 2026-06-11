import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';

export default function Lawyers() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: queryError } = await supabase.from('lawyers').select('*').eq('is_active', true).order('name');
        if (queryError) throw queryError;
        setItems(data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => `${item.name} ${item.oab_number} ${item.specialties} ${item.city}`.toLowerCase().includes(term));
  }, [items, search]);

  if (error) return <ErrorBox message={error} />;
  if (loading) return <Loading />;

  return (
    <section className="section page-section">
      <div className="container section-head">
        <span className="eyebrow">Encontre profissionais</span>
        <h1>Advogados cadastrados</h1>
        <p>Espaço para divulgação de profissionais e especialidades informadas pela administração da plataforma.</p>
      </div>
      <div className="container filters single">
        <input placeholder="Buscar por nome, OAB, cidade ou especialidade..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="container card-grid">
        {filtered.length === 0 && <EmptyState title="Nenhum advogado encontrado." text="A área administrativa pode cadastrar novos profissionais." />}
        {filtered.map((item) => (
          <article className="card profile-card" key={item.id}>
            <span className="avatar-symbol">⚖</span>
            <h3>{item.name}</h3>
            <p><strong>OAB:</strong> {item.oab_number}</p>
            <p><strong>Especialidades:</strong> {item.specialties}</p>
            <p><strong>Cidade:</strong> {item.city}</p>
            {item.phone && <p><strong>Telefone:</strong> {item.phone}</p>}
            {item.email && <p><strong>E-mail:</strong> {item.email}</p>}
            {item.address && <p><strong>Endereço:</strong> {item.address}</p>}
            {item.notes && <p className="muted">{item.notes}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
