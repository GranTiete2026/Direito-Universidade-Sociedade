import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contents from './pages/Contents';
import ContentDetail from './pages/ContentDetail';
import Lawyers from './pages/Lawyers';
import Services from './pages/Services';
import Internships from './pages/Internships';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminApp from './admin/AdminApp';
import NotFound from './pages/NotFound';

function PublicPage({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPage><Home /></PublicPage>} />
      <Route path="/conteudos" element={<PublicPage><Contents /></PublicPage>} />
      <Route path="/conteudos/:slug" element={<PublicPage><ContentDetail /></PublicPage>} />
      <Route path="/advogados" element={<PublicPage><Lawyers /></PublicPage>} />
      <Route path="/servicos" element={<PublicPage><Services /></PublicPage>} />
      <Route path="/estagios" element={<PublicPage><Internships /></PublicPage>} />
      <Route path="/eventos" element={<PublicPage><Events /></PublicPage>} />
      <Route path="/sobre" element={<PublicPage><About /></PublicPage>} />
      <Route path="/contato" element={<PublicPage><Contact /></PublicPage>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
    </Routes>
  );
}
