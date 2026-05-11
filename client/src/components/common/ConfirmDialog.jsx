import Modal from './Modal'
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, confirmText = 'Delete', danger = true }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
      <button onClick={() => { onConfirm(); onClose(); }} className={`px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'}`}>
        {confirmText}
      </button>
    </div>
  </Modal>
)
export default ConfirmDialog
