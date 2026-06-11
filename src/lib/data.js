import { supabase } from './supabase';

export async function getSettings() {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getHomeData() {
  const [settings, areas, contents, lawyers, services, events, internships] = await Promise.all([
    getSettings(),
    supabase.from('legal_areas').select('*').eq('is_active', true).order('display_order'),
    supabase.from('legal_contents').select('*, legal_areas(name, slug)').eq('is_published', true).eq('is_featured', true).order('updated_at', { ascending: false }).limit(6),
    supabase.from('lawyers').select('*').eq('is_active', true).order('name').limit(6),
    supabase.from('service_links').select('*').eq('is_active', true).order('display_order').limit(8),
    supabase.from('events').select('*').eq('is_active', true).gte('event_date', new Date().toISOString()).order('event_date').limit(4),
    supabase.from('internships').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(4)
  ]);

  const responses = [areas, contents, lawyers, services, events, internships];
  const firstError = responses.find((item) => item.error)?.error;
  if (firstError) throw firstError;

  return {
    settings,
    areas: areas.data ?? [],
    contents: contents.data ?? [],
    lawyers: lawyers.data ?? [],
    services: services.data ?? [],
    events: events.data ?? [],
    internships: internships.data ?? []
  };
}

export async function insertContactMessage(payload) {
  const { error } = await supabase.from('contact_messages').insert(payload);
  if (error) throw error;
}
