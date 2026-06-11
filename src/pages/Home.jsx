import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData } from '../lib/data';
import { formatDate, excerpt } from '../lib/format';
import Loading from '../components/Loading';
import ErrorBox from '../components/ErrorBox';
import EmptyState from '../components/EmptyState';
import ContactForm from '../components/ContactForm';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHomeData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <Loading />;

  const settings = data.settings ?? {};

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Curso de Direito • Projeto de Extensão</span>
            <h1>{settings.site_name || 'Universidade e Sociedade'}</h1>
            <h2>{settings.hero_title || 'Plataforma Digital para Ampliação do Acesso à Justiça'}</h2>
            <p>{settings.hero_subtitle || 'Informação jurídica, orientação cidadã e oportunidades ao seu alcance.'}</p>
            <div className="hero-actions">
              <Link className="button primary" to="/conteudos">Acessar informações</Link>
              <Link className="button secondary" to="/contato">Pedir orientação inicial</Link>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/images/referencia-alunos.jpeg" alt="Imagem de referência criada para o projeto Universidade e Sociedade" />
          </div>
        </div>
      </section>

      <section className="container quick-grid">
        <Link className="quick-card" to="/advogados"><span>⌕</span><strong>Encontre advogados</strong><small>Busca por profissionais e especialidades.</small></Link>
        <Link className="quick-card" to="/servicos"><span>⌖</span><strong>Acesso fácil</strong><small>Órgãos, serviços e canais de atendimento.</small></Link>
        <Link className="quick-card" to="/estagios"><span>▱</span><strong>Banco de estágios</strong><small>Oportunidades para estudantes.</small></Link>
        <Link className="quick-card" to="/conteudos"><span>⚖</span><strong>Justiça para todos</strong><small>Educação em direitos e cidadania.</small></Link>
      </section>

      <section className="section tinted">
        <div className="container section-head">
          <span className="eyebrow">Informação que orienta</span>
          <h2>Áreas jurídicas</h2>
          <p>Conteúdos organizados em linguagem acessível para ajudar a população a dar o primeiro passo.</p>
        </div>
        <div className="container card-grid areas-grid">
          {data.areas.map((area) => (
            <Link className="card area-card" key={area.id} to={`/conteudos?area=${area.slug}`}>
              <span className="icon-badge">{area.icon || '⚖'}</span>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container section-head split">
          <div>
            <span className="eyebrow">Orientações jurídicas</span>
            <h2>Conteúdos em destaque</h2>
          </div>
          <Link to="/conteudos" className="text-link">Ver todos</Link>
        </div>
        <div className="container card-grid">
          {data.contents.length === 0 && <EmptyState />}
          {data.contents.map((content) => (
            <article className="card content-card" key={content.id}>
              <small>{content.legal_areas?.name}</small>
              <h3>{content.title}</h3>
              <p>{content.summary}</p>
              <Link className="text-link" to={`/conteudos/${content.slug}`}>Ler orientação</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section navy-panel">
        <div className="container panel-grid">
          <div>
            <span className="eyebrow gold">Conhecimento que transforma</span>
            <h2>Órgãos, eventos e oportunidades conectados em um só lugar.</h2>
            <p>Um ambiente simples para a comunidade acessar informações e para a equipe do projeto manter a plataforma atualizada.</p>
          </div>
          <div className="mini-lists">
            <div className="mini-card">
              <h3>Próximos eventos</h3>
              {data.events.length === 0 && <p>Nenhum evento publicado.</p>}
              {data.events.map((event) => <p key={event.id}><strong>{formatDate(event.event_date)}</strong> — {event.title}</p>)}
            </div>
            <div className="mini-card">
              <h3>Estágios</h3>
              {data.internships.length === 0 && <p>Nenhuma oportunidade ativa.</p>}
              {data.internships.map((item) => <p key={item.id}><strong>{item.organization}</strong> — {excerpt(item.title, 70)}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-section">
          <div>
            <span className="eyebrow">Contato</span>
            <h2>Envie uma mensagem para a equipe do projeto</h2>
            <p>A mensagem será registrada no banco da plataforma e poderá ser acompanhada na área administrativa.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
