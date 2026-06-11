import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Universidade e Sociedade</h3>
          <p>Plataforma digital de informação jurídica, cidadania e aproximação entre faculdade, OAB e comunidade.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <Link to="/conteudos">Informações jurídicas</Link>
          <Link to="/advogados">Encontrar advogados</Link>
          <Link to="/servicos">Órgãos e serviços</Link>
        </div>
        <div>
          <h4>Participação</h4>
          <Link to="/estagios">Banco de estágios</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/contato">Contato</Link>
        </div>
      </div>
      <div className="footer-bottom">Conteúdo informativo. Não substitui consulta profissional individualizada.</div>
    </footer>
  );
}
