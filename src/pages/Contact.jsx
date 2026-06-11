import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <section className="section page-section">
      <div className="container contact-section">
        <div>
          <span className="eyebrow">Fale conosco</span>
          <h1>Contato com a equipe do projeto</h1>
          <p>Use este canal para enviar dúvidas, sugestões, pedidos de correção ou interesse em parcerias. A mensagem ficará disponível na área administrativa.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
