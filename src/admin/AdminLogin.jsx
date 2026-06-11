import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="brand login-brand"><span className="brand-mark">GT</span><span><strong>Gran Tietê</strong><small>Área administrativa</small></span></Link>
        <h1>Entrar no painel</h1>
        <p>Use o usuário criado no Supabase Auth e liberado na tabela de administradores.</p>
        <form onSubmit={handleSubmit}>
          <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <div className="alert error">{error}</div>}
          <button className="button primary full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <Link className="text-link" to="/">Voltar ao site</Link>
      </section>
    </main>
  );
}
