export default function ErrorBox({ message }) {
  return <div className="container alert error">{message || 'Não foi possível carregar as informações.'}</div>;
}
