import { slugify } from '../lib/slug';

export function buildEmptyForm(fields) {
  return fields.reduce((acc, field) => {
    if (field.defaultValue !== undefined) acc[field.name] = field.defaultValue;
    else if (field.type === 'checkbox') acc[field.name] = false;
    else acc[field.name] = '';
    return acc;
  }, {});
}

export function normalizeFormForEdit(row, fields) {
  const data = buildEmptyForm(fields);
  fields.forEach((field) => {
    const value = row[field.name];
    if (field.type === 'datetime-local' && value) {
      data[field.name] = new Date(value).toISOString().slice(0, 16);
    } else if (field.type === 'date' && value) {
      data[field.name] = String(value).slice(0, 10);
    } else if (field.type === 'checkbox') {
      data[field.name] = Boolean(value);
    } else {
      data[field.name] = value ?? '';
    }
  });
  return data;
}

export function preparePayload(form, fields, slugFrom) {
  const payload = {};
  fields.forEach((field) => {
    let value = form[field.name];
    if (field.type === 'number') value = value === '' || value === null ? null : Number(value);
    if (field.type === 'checkbox') value = Boolean(value);
    if ((field.type === 'date' || field.type === 'datetime-local') && value === '') value = null;
    if (field.type === 'select' && field.valueType === 'number') value = value === '' ? null : Number(value);
    payload[field.name] = value;
  });

  if (slugFrom && 'slug' in payload && !payload.slug) {
    payload.slug = slugify(payload[slugFrom]);
  }

  return payload;
}

export function renderValue(value, field) {
  if (field.type === 'checkbox') return value ? 'Sim' : 'Não';
  if (!value) return '-';
  if (field.type === 'date') return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  if (field.type === 'datetime-local') return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
}
