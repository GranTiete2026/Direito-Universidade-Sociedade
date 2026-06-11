import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDateTime } from '../lib/format';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';

export default function Events() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: queryError } = await supabase.from('events').select('*').eq('is_active', true).order('event_date');
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
        <span className="eyebrow">Agenda cidadã</span>
        <h1>Eventos jurídicos e acadêmicos</h1>
        <p>Divulgação de ações promovidas pela faculdade, OAB e parceiros institucionais.</p>
      </div>
      <div className="container card-grid">
        {items.length === 0 && <EmptyState title="Nenhum evento ativo." />}
        {items.map((item) => (
          <article className="card event-card" key={item.id}>
            <small>{formatDateTime(item.event_date)}</small>
            <h3>{item.title}</h3>
            <p><strong>Organização:</strong> {item.organizer}</p>
            <p>{item.description}</p>
            <p><strong>Local:</strong> {item.location}</p>
            {item.url && <a className="button compact" href={item.url} target="_blank" rel="noreferrer">Inscrição ou detalhes</a>}
          </article>
        ))}
      </div>
    </section>
  );
}
