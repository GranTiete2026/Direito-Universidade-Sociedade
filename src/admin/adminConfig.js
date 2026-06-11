export const adminMenu = [
  { to: '/admin', label: 'Painel', icon: '▣' },
  { to: '/admin/configuracoes', label: 'Configurações', icon: '⚙' },
  { to: '/admin/areas', label: 'Áreas jurídicas', icon: '⚖' },
  { to: '/admin/conteudos', label: 'Conteúdos', icon: '▤' },
  { to: '/admin/advogados', label: 'Advogados', icon: '§' },
  { to: '/admin/servicos', label: 'Serviços', icon: '⌖' },
  { to: '/admin/estagios', label: 'Estágios', icon: '▱' },
  { to: '/admin/eventos', label: 'Eventos', icon: '◷' },
  { to: '/admin/mensagens', label: 'Mensagens', icon: '✉' }
];

export const areaFields = [
  { name: 'name', label: 'Nome', required: true, table: true },
  { name: 'slug', label: 'Slug', help: 'Se ficar vazio, será gerado automaticamente.', table: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true, table: true },
  { name: 'icon', label: 'Ícone', defaultValue: '⚖', table: true },
  { name: 'display_order', label: 'Ordem', type: 'number', defaultValue: 0, table: true },
  { name: 'is_active', label: 'Ativo', type: 'checkbox', defaultValue: true, table: true }
];

export const lawyerFields = [
  { name: 'name', label: 'Nome', required: true, table: true },
  { name: 'oab_number', label: 'Número OAB', required: true, table: true },
  { name: 'specialties', label: 'Especialidades', required: true, table: true },
  { name: 'city', label: 'Cidade', table: true },
  { name: 'phone', label: 'Telefone', table: true },
  { name: 'email', label: 'E-mail', type: 'email', table: true },
  { name: 'address', label: 'Endereço' },
  { name: 'notes', label: 'Observações', type: 'textarea' },
  { name: 'is_active', label: 'Ativo', type: 'checkbox', defaultValue: true, table: true }
];

export const serviceFields = [
  { name: 'title', label: 'Título', required: true, table: true },
  { name: 'category', label: 'Categoria', required: true, table: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true, table: true },
  { name: 'url', label: 'URL', type: 'url', table: true },
  { name: 'phone', label: 'Telefone', table: true },
  { name: 'display_order', label: 'Ordem', type: 'number', defaultValue: 0, table: true },
  { name: 'is_active', label: 'Ativo', type: 'checkbox', defaultValue: true, table: true }
];

export const internshipFields = [
  { name: 'title', label: 'Título', required: true, table: true },
  { name: 'organization', label: 'Organização', required: true, table: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true, table: true },
  { name: 'requirements', label: 'Requisitos', type: 'textarea', table: true },
  { name: 'contact', label: 'Contato', table: true },
  { name: 'deadline', label: 'Prazo', type: 'date', table: true },
  { name: 'is_active', label: 'Ativo', type: 'checkbox', defaultValue: true, table: true }
];

export const eventFields = [
  { name: 'title', label: 'Título', required: true, table: true },
  { name: 'organizer', label: 'Organização', required: true, table: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: true, table: true },
  { name: 'location', label: 'Local', required: true, table: true },
  { name: 'url', label: 'URL', type: 'url', table: true },
  { name: 'event_date', label: 'Data e horário', type: 'datetime-local', required: true, table: true },
  { name: 'is_active', label: 'Ativo', type: 'checkbox', defaultValue: true, table: true }
];

export const settingsFields = [
  { name: 'site_name', label: 'Nome do projeto', required: true },
  { name: 'institution_name', label: 'Instituição', required: true },
  { name: 'hero_title', label: 'Título principal', required: true },
  { name: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', required: true },
  { name: 'contact_email', label: 'E-mail de contato', type: 'email' },
  { name: 'contact_phone', label: 'Telefone de contato' },
  { name: 'city', label: 'Cidade' },
  { name: 'primary_color', label: 'Cor primária', type: 'color', defaultValue: '#06284A' },
  { name: 'accent_color', label: 'Cor de destaque', type: 'color', defaultValue: '#D79A43' }
];
