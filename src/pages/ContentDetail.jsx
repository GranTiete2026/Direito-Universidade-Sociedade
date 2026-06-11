import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';

export default function ContentDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error: queryError } = await supabase
          .from('legal_contents')
          .select('*, legal_areas(name, slug)')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();
        if (queryError) throw queryError;
        setContent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (error) return <ErrorBox message={error} />;
  if (loading) return <Loading />;
  if (!content) return <ErrorBox message="Conteúdo não encontrado." />;

  return (
    <article className="section article-page">
      <div className="container narrow">
        <Link className="text-link" to="/conteudos">← Voltar aos conteúdos</Link>
        <span className="eyebrow">{content.legal_areas?.name}</span>
        <h1>{content.title}</h1>
        <p className="lead">{content.summary}</p>
        <div className="article-body">
          {String(content.body ?? '').split('\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        {content.source && <p className="source">Fonte/observação: {content.source}</p>}
        <div className="notice-box">Este conteúdo é educativo e não substitui consulta jurídica profissional ou atendimento por órgão competente.</div>
      </div>
    </article>
  );
}
