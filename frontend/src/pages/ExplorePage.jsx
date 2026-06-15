import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import ArtisanCard from '../components/ArtisanCard';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtisans = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users/artisans');
        setArtisans(res || []);
      } catch (e) {
        console.error('[ExplorePage] Failed to load artisans:', e);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    };
    loadArtisans();
  }, []);

  const filtered = artisans.filter(a =>
    (a.displayName || a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.bio || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pt-8 md:pt-12 pb-32 md:pb-16 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">Explore Indian Artisans</h1>
            <p className="text-gray-500 font-medium text-lg">Discover the traditional masters behind the craft</p>
          </div>

          <div className="relative w-full md:w-96 shrink-0">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search by name or craft..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-transparent rounded-full pl-10 md:pl-14 pr-4 md:pr-8 py-3 md:py-4 text-sm md:text-base font-bold outline-none focus:border-pink-500/10 transition-all shadow-sm placeholder:text-sm md:placeholder:text-base"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="text-gray-400 font-black">Loading artisans...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filtered.map((artisan) => (
              <ArtisanCard 
                key={artisan._id || artisan.id} 
                artisan={artisan} 
                onClick={() => navigate(`/profile/${artisan._id || artisan.id}`)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest">
              {search ? `No artisans match "${search}"` : 'No artisans yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
