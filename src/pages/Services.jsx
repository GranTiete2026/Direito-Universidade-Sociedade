import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';

export default function Services() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: queryError } = await supabase.from('service_links').select('*').eq('is_active', true).order('display_order');
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

  const categories = useMemo(() => [...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const filtered = category ? items.filter((item) => item.category === category) : items;

  if (error) return <ErrorBox message={error} />;
  if (loading) return <Loading />;

  return (
    <section className="section page-section">
      <div className="container section-head">
        <span className="eyebrow">Acesso fácil</span>
        <h1>Órgãos e serviços</h1>
        <p>Canais úteis para orientação inicial, atendimento público e encaminhamento de demandas.</p>
      </div>
      <div className="container filters single">
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="container card-grid">
        {filtered.length === 0 && <EmptyState title="Nenhum serviço cadastrado." />}
        {filtered.map((item) => (
          <article className="card service-card" key={item.id}>
            <small>{item.category}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.phone && <p><strong>Telefone:</strong> {item.phone}</p>}
            {item.url && <a className="button compact" href={item.url} target="_blank" rel="noreferrer">Acessar serviço</a>}
          </article>
        ))}
      </div>
    </section>
  );
}
