import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import '../../styles/components.css'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'modal-sm', md: 'modal-md', lg: 'modal-lg', xl: 'modal-xl' }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
            className={`modal-content ${sizes[size]}`}
          >
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button onClick={onClose} className="modal-close-btn">
                <HiX style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
            <div className="modal-body scrollbar-thin">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
