import { useEffect } from 'react';
import { FaEthereum, FaTimes } from 'react-icons/fa';

export const TransactionModal = ({ isOpen, onClose, onSubmit, title, type }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ padding: '0.5rem', margin: 0 }}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit(e.target.amount.value);
          onClose();
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              name="amount"
              step="0.000000000000000001"
              required
              placeholder="0.0"
              autoFocus
            />
            <FaEthereum style={{ 
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#60a5fa'
            }}/>
          </div>
          <button type="submit" style={{ width: '100%' }}>
            {type === 'deposit' ? 'Depositar' : 'Retirar'} ETH
          </button>
        </form>
      </div>
    </div>
  );
};

// export default TransactionModal;