import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section page-section">
      <div className="container narrow center">
        <span className="eyebrow">404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe ou foi alterado.</p>
        <Link className="button primary" to="/">Voltar ao início</Link>
      </div>
    </section>
  );
}
