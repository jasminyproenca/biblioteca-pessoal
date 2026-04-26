export function Spinner() {
  return <div className="spinner-wrap"><div className="spinner" /></div>;
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {text && <p className="empty-state-text">{text}</p>}
      {action}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    'lido':       'badge-lido',
    'lendo':      'badge-lendo',
    'abandonado': 'badge-abandonado',
    'emprestado': 'badge-emprestado',
    'quero ler':  'badge-quero-ler',
  };
  return <span className={`badge ${map[status] || 'badge-quero-ler'}`}>{status}</span>;
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function StarRating({ value }) {
  return (
    <div className="rating">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`star ${s <= (value || 0) ? 'filled' : ''}`}>★</span>
      ))}
    </div>
  );
}
