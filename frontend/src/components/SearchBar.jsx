import { useState, useEffect, useRef } from 'react';
import { getProducts } from '../api';
import { getProductImage } from '../config/imageMappings';

export default function SearchBar({ value, onChange, placeholder }) {
  const [localQuery, setLocalQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [localQuery, onChange]);

  useEffect(() => {
    if (!localQuery.trim()) {
      setSuggestions([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        const res = await getProducts({ search: localQuery, limit: 5 });
        setSuggestions(res.products || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSuggestions();
  }, [localQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full max-w-lg">
      <div className="relative group">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
          🔍
        </span>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-200 transition-all outline-none"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-elevated border border-gray-100 overflow-hidden z-[110] animate-slide-up">
          <div className="p-3 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-50">Suggestions</div>
          {suggestions.map((p) => (
            <button
              key={p._id}
              onClick={() => {
                setLocalQuery(p.title);
                setShowDropdown(false);
              }}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                <img src={getProductImage(p.image, p.category)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900">{p.title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{p.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
