import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/format';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';

export default function Internships() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: queryError } = await supabase.from('internships').select('*').eq('is_active', true).order('created_at', { ascending: false });
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

  if (error) return <ErrorBox message={error} />;
  if (loading) return <Loading />;

  return (
    <section className="section page-section">
      <div className="container section-head">
        <span className="eyebrow">Banco de estágios</span>
        <h1>Oportunidades para estudantes</h1>
        <p>Área dedicada à divulgação de vagas, cadastros de interesse e oportunidades acadêmicas.</p>
      </div>
      <div className="container card-grid">
        {items.length === 0 && <EmptyState title="Nenhuma oportunidade ativa." />}
        {items.map((item) => (
          <article className="card job-card" key={item.id}>
            <small>{item.organization}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.requirements && <p><strong>Requisitos:</strong> {item.requirements}</p>}
            {item.deadline && <p><strong>Prazo:</strong> {formatDate(item.deadline)}</p>}
            {item.contact && <p><strong>Contato:</strong> {item.contact}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
