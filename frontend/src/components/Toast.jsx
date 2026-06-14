// Toast.jsx
// Simple top-center toast for lightweight feedback.
import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-2xl bg-gray-900 text-white shadow-elevated text-sm"
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

