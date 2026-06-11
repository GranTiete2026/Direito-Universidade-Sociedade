import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminCrudPage from './AdminCrudPage';

export default function AdminContentPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAreas() {
      const { data } = await supabase.from('legal_areas').select('id, name').order('display_order');
      setAreas(data ?? []);
      setLoading(false);
    }
    loadAreas();
  }, []);

  const contentFields = [
    { name: 'legal_area_id', label: 'Área jurídica', type: 'select', valueType: 'number', required: true, table: true, options: areas.map((area) => ({ value: area.id, label: area.name })) },
    { name: 'title', label: 'Título', required: true, table: true },
    { name: 'slug', label: 'Slug', help: 'Se ficar vazio, será gerado automaticamente.', table: true },
    { name: 'summary', label: 'Resumo', type: 'textarea', required: true, table: true },
    { name: 'body', label: 'Texto completo', type: 'textarea', rows: 8, required: true },
    { name: 'source', label: 'Fonte/observação' },
    { name: 'is_featured', label: 'Destaque na página inicial', type: 'checkbox', defaultValue: true, table: true },
    { name: 'is_published', label: 'Publicado', type: 'checkbox', defaultValue: true, table: true }
  ];

  if (loading) return <div className="admin-page"><p>Carregando áreas...</p></div>;

  return (
    <AdminCrudPage
      title="Conteúdos jurídicos"
      description="Publique orientações acessíveis para a população. Evite linguagem técnica excessiva e inclua aviso de caráter informativo quando necessário."
      table="legal_contents"
      fields={contentFields}
      order={{ column: 'updated_at', ascending: false }}
      slugFrom="title"
    />
  );
}
