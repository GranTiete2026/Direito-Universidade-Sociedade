import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getSettings } from '../lib/data';

export default function Layout({ children }) {
  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (!settings) return;
        if (settings.primary_color) document.documentElement.style.setProperty('--blue-900', settings.primary_color);
        if (settings.accent_color) {
          document.documentElement.style.setProperty('--gold-500', settings.accent_color);
          document.documentElement.style.setProperty('--gold-600', settings.accent_color);
        }
      })
      .catch(() => null);
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
