import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { buildEmptyForm, normalizeFormForEdit, preparePayload, renderValue } from './formHelpers';

export default function AdminCrudPage({ title, description, table, fields, order, select = '*', slugFrom }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(() => buildEmptyForm(fields));
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const tableFields = useMemo(() => fields.filter((field) => field.table).slice(0, 6), [fields]);

  async function loadRows() {
    setLoading(true);
    setError('');
    let query = supabase.from(table).select(select);
    if (order?.column) query = query.order(order.column, { ascending: order.ascending ?? true });
    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    else setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadRows();
  }, [table]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function startCreate() {
    setEditing(null);
    setForm(buildEmptyForm(fields));
    setError('');
    setSuccess('');
  }

  function startEdit(row) {
    setEditing(row);
    setForm(normalizeFormForEdit(row, fields));
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = preparePayload(form, fields, slugFrom);
      const result = editing
        ? await supabase.from(table).update(payload).eq('id', editing.id)
        : await supabase.from(table).insert(payload);
      if (result.error) throw result.error;
      setEditing(null);
      setForm(buildEmptyForm(fields));
      await loadRows();
      setSuccess(editing ? 'Registro atualizado.' : 'Registro criado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    setError('');
    const { error: deleteError } = await supabase.from(table).delete().eq('id', row.id);
    if (deleteError) setError(deleteError.message);
    else await loadRows();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Gerenciamento</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button className="button secondary" onClick={startCreate}>Novo registro</button>
      </div>

      <form className="admin-form card" onSubmit={save}>
        <h2>{editing ? 'Editar registro' : 'Cadastrar novo'}</h2>
        <div className="form-grid">
          {fields.map((field) => <AdminField key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}
        </div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <div className="form-actions">
          <button className="button primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          {editing && <button className="button ghost" type="button" onClick={startCreate}>Cancelar edição</button>}
        </div>
      </form>

      <div className="admin-table-wrap card">
        <h2>Registros cadastrados</h2>
        {loading ? <p>Carregando...</p> : (
          <table className="admin-table">
            <thead>
              <tr>{tableFields.map((field) => <th key={field.name}>{field.label}</th>)}<th>Ações</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={tableFields.length + 1}>Nenhum registro encontrado.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id}>
                  {tableFields.map((field) => <td key={field.name}>{renderValue(row[field.name], field)}</td>)}
                  <td className="actions-cell">
                    <button className="button compact" onClick={() => startEdit(row)}>Editar</button>
                    <button className="button danger compact" onClick={() => remove(row)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function AdminField({ field, value, onChange }) {
  const common = {
    id: field.name,
    name: field.name,
    value: value ?? '',
    onChange,
    required: field.required ?? false,
    placeholder: field.placeholder ?? ''
  };

  if (field.type === 'checkbox') {
    return (
      <label className="checkbox-field">
        <input id={field.name} name={field.name} type="checkbox" checked={Boolean(value)} onChange={onChange} />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label className={field.type === 'textarea' ? 'wide' : ''}>
      {field.label}
      {field.type === 'textarea' ? (
        <textarea {...common} rows={field.rows ?? 4} />
      ) : field.type === 'select' ? (
        <select {...common}>
          <option value="">Selecione...</option>
          {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input {...common} type={field.type ?? 'text'} />
      )}
      {field.help && <small className="help-text">{field.help}</small>}
    </label>
  );
}
