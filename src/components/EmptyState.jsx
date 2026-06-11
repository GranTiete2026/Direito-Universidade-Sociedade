export default function EmptyState({ title = 'Nenhum registro encontrado.', text = 'Volte novamente em breve.' }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
