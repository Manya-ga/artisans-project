import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PageHeader({ title, showBack = false, rightElement = null }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sticky top-0 z-[10] bg-[#fafafa]/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && mounted && (
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 hover:scale-105 hover:text-pink-500 transition-all text-gray-700 group"
              aria-label="Go Back"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          {title && <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{title}</h1>}
        </div>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </div>
  );
}
