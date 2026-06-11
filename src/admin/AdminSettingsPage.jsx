import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AdminField } from './AdminCrudPage';
import { buildEmptyForm, normalizeFormForEdit, preparePayload } from './formHelpers';
import { settingsFields } from './adminConfig';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(() => buildEmptyForm(settingsFields));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      const { data, error: queryError } = await supabase.from('platform_settings').select('*').order('created_at').limit(1).maybeSingle();
      if (queryError) setError(queryError.message);
      if (data) {
        setSettings(data);
        setForm(normalizeFormForEdit(data, settingsFields));
      }
      setLoading(false);
    }
    load();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = preparePayload(form, settingsFields);
      const result = settings
        ? await supabase.from('platform_settings').update(payload).eq('id', settings.id)
        : await supabase.from('platform_settings').insert(payload).select('*').single();
      if (result.error) throw result.error;
      if (result.data) setSettings(result.data);
      setSuccess('Configurações atualizadas.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-page"><p>Carregando configurações...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Identidade da plataforma</span>
          <h1>Configurações</h1>
          <p>Atualize textos principais, contatos e cores institucionais.</p>
        </div>
      </div>
      <form className="admin-form card" onSubmit={save}>
        <div className="form-grid">
          {settingsFields.map((field) => <AdminField key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}
        </div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <button className="button primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar configurações'}</button>
      </form>
    </div>
  );
}
