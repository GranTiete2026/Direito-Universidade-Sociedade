import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';

export default function Contents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [areas, setAreas] = useState([]);
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const area = searchParams.get('area') ?? '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [areasResult, contentsResult] = await Promise.all([
          supabase.from('legal_areas').select('*').eq('is_active', true).order('display_order'),
          supabase.from('legal_contents').select('*, legal_areas(name, slug)').eq('is_published', true).order('updated_at', { ascending: false })
        ]);
        if (areasResult.error) throw areasResult.error;
        if (contentsResult.error) throw contentsResult.error;
        setAreas(areasResult.data ?? []);
        setContents(contentsResult.data ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return contents.filter((item) => {
      const matchArea = !area || item.legal_areas?.slug === area;
      const term = search.trim().toLowerCase();
      const matchSearch = !term || `${item.title} ${item.summary} ${item.body}`.toLowerCase().includes(term);
      return matchArea && matchSearch;
    });
  }, [contents, area, search]);

  if (error) return <ErrorBox message={error} />;
  if (loading) return <Loading />;

  return (
    <section className="section page-section">
      <div className="container section-head">
        <span className="eyebrow">Informação jurídica</span>
        <h1>Conteúdos para a comunidade</h1>
        <p>Orientações introdutórias para educação em direitos. O conteúdo não substitui atendimento profissional.</p>
      </div>
      <div className="container filters">
        <input placeholder="Buscar conteúdo..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={area} onChange={(event) => setSearchParams(event.target.value ? { area: event.target.value } : {})}>
          <option value="">Todas as áreas</option>
          {areas.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      <div className="container card-grid">
        {filtered.length === 0 && <EmptyState title="Nenhum conteúdo encontrado." text="Tente alterar a busca ou a área jurídica." />}
        {filtered.map((content) => (
          <article className="card content-card" key={content.id}>
            <small>{content.legal_areas?.name}</small>
            <h3>{content.title}</h3>
            <p>{content.summary}</p>
            <Link className="button compact" to={`/conteudos/${content.slug}`}>Abrir conteúdo</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
