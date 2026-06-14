// Header.jsx
// High-level application header used across pages, showing brand identity and primary tagline.
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="mb-6 md:mb-8 lg:mb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gradient font-display">
            Artisan Connect
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Discover and support local makers, globally.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-soft float">
            <span className="text-xs font-semibold text-primary-500">NEW</span>
          </div>
          <div className="text-xs text-gray-500 max-w-[160px]">
            Curated daily drops from independent artisans.
          </div>
        </div>
      </motion.div>
    </header>
  );
}

