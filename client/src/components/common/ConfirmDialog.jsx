import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmText = 'Delete', danger = true }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="dialog-message">{message}</p>
    <div className="dialog-actions">
      <button onClick={onClose} className="btn btn-outline">Cancel</button>
      <button onClick={() => { onConfirm(); onClose(); }} className={danger ? 'btn-danger' : 'btn btn-primary'}>
        {confirmText}
      </button>
    </div>
  </Modal>
)

export default ConfirmDialog
