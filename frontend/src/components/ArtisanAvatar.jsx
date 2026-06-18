import React, { useState } from 'react';

const colors = [
  'bg-orange-100 text-orange-700',
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700'
];

export default function ArtisanAvatar({ name, className = '', isArtisan = true, photoURL = null }) {
  const [imgError, setImgError] = useState(false);
  const safeName = name || 'Unknown';
  const initials = safeName.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  
  // Deterministic color assignment based on name
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const colorClass = colors[colorIndex];

  // If not an artisan and has a photo, show the photo
  if (!isArtisan && photoURL && !imgError) {
    return (
      <img 
        src={photoURL} 
        alt={safeName} 
        loading="lazy"
        className={`object-cover ${className}`} 
        onError={() => setImgError(true)}
      />
    );
  }

  // Artisan or failed image -> show Initials Avatar
  return (
    <div className={`flex items-center justify-center font-bold ${colorClass} ${className} shrink-0`}>
      {initials}
    </div>
  );
}
