import { useState } from 'react';
import { insertContactMessage } from '../lib/data';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      await insertContactMessage(form);
      setForm(initialForm);
      setStatus({ type: 'success', text: 'Mensagem enviada com sucesso. A equipe responsável poderá analisar o contato na área administrativa.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="contact-form card" onSubmit={handleSubmit}>
      <div className="form-row two">
        <label>
          Nome
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>
      </div>
      <div className="form-row two">
        <label>
          Telefone
          <input name="phone" value={form.phone} onChange={updateField} />
        </label>
        <label>
          Assunto
          <input name="subject" value={form.subject} onChange={updateField} required />
        </label>
      </div>
      <label>
        Mensagem
        <textarea name="message" value={form.message} onChange={updateField} required rows="5" />
      </label>
      <p className="help-text">Não envie dados excessivamente sensíveis. A plataforma tem finalidade informativa e de encaminhamento inicial.</p>
      {status && <div className={`alert ${status.type}`}>{status.text}</div>}
      <button className="button primary" disabled={saving}>{saving ? 'Enviando...' : 'Enviar mensagem'}</button>
    </form>
  );
}
