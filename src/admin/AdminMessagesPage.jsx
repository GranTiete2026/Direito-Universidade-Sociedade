import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDateTime } from '../lib/format';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error: queryError } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (queryError) setError(queryError.message);
    else setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function openMessage(message) {
    setSelected(message);
    if (!message.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', message.id);
      await load();
    }
  }

  async function remove(message) {
    if (!confirm('Excluir esta mensagem?')) return;
    const { error: deleteError } = await supabase.from('contact_messages').delete().eq('id', message.id);
    if (deleteError) setError(deleteError.message);
    else {
      setSelected(null);
      await load();
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Contato</span>
          <h1>Mensagens recebidas</h1>
          <p>Mensagens enviadas pelo formulário público da plataforma.</p>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="messages-grid">
        <div className="card message-list">
          {loading && <p>Carregando...</p>}
          {!loading && messages.length === 0 && <p>Nenhuma mensagem recebida.</p>}
          {messages.map((message) => (
            <button key={message.id} className={message.is_read ? 'message-item' : 'message-item unread'} onClick={() => openMessage(message)}>
              <strong>{message.subject}</strong>
              <span>{message.name} • {formatDateTime(message.created_at)}</span>
            </button>
          ))}
        </div>
        <div className="card message-detail">
          {!selected && <p>Selecione uma mensagem para visualizar.</p>}
          {selected && (
            <>
              <h2>{selected.subject}</h2>
              <p><strong>Nome:</strong> {selected.name}</p>
              <p><strong>E-mail:</strong> {selected.email}</p>
              <p><strong>Telefone:</strong> {selected.phone || '-'}</p>
              <p><strong>Data:</strong> {formatDateTime(selected.created_at)}</p>
              <hr />
              <p>{selected.message}</p>
              <button className="button danger" onClick={() => remove(selected)}>Excluir mensagem</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
