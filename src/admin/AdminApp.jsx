import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminCrudPage from './AdminCrudPage';
import AdminContentPage from './AdminContentPage';
import AdminSettingsPage from './AdminSettingsPage';
import AdminMessagesPage from './AdminMessagesPage';
import { areaFields, lawyerFields, serviceFields, internshipFields, eventFields } from './adminConfig';

export default function AdminApp() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (ignore) return;
      const currentSession = data.session;
      setSession(currentSession);
      if (!currentSession) {
        setLoading(false);
        return;
      }

      const { data: adminProfile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !adminProfile) {
        setBlocked(true);
        await supabase.auth.signOut();
      } else {
        setProfile(adminProfile);
      }
      setLoading(false);
    }

    check();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="admin-loading">Carregando painel...</div>;
  if (!session || blocked) return <Navigate to="/admin/login" replace />;

  return (
    <AdminLayout profile={profile}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="configuracoes" element={<AdminSettingsPage />} />
        <Route path="areas" element={<AdminCrudPage title="Áreas jurídicas" description="Organize as áreas exibidas nos conteúdos públicos." table="legal_areas" fields={areaFields} order={{ column: 'display_order', ascending: true }} slugFrom="name" />} />
        <Route path="conteudos" element={<AdminContentPage />} />
        <Route path="advogados" element={<AdminCrudPage title="Advogados" description="Cadastre profissionais e especialidades para busca pública." table="lawyers" fields={lawyerFields} order={{ column: 'name', ascending: true }} />} />
        <Route path="servicos" element={<AdminCrudPage title="Órgãos e serviços" description="Gerencie canais de atendimento e serviços úteis." table="service_links" fields={serviceFields} order={{ column: 'display_order', ascending: true }} />} />
        <Route path="estagios" element={<AdminCrudPage title="Banco de estágios" description="Publique oportunidades e cadastros de interesse." table="internships" fields={internshipFields} order={{ column: 'created_at', ascending: false }} />} />
        <Route path="eventos" element={<AdminCrudPage title="Eventos" description="Divulgue ações jurídicas e acadêmicas." table="events" fields={eventFields} order={{ column: 'event_date', ascending: true }} />} />
        <Route path="mensagens" element={<AdminMessagesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}
