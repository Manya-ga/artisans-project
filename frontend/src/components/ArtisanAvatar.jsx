import React, { useState } from 'react';

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
};

export default function ArtisanAvatar({ name, photoURL, isArtisan, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  const colors = [
    'bg-pink-100 text-pink-600',
    'bg-blue-100 text-blue-600',
    'bg-amber-100 text-amber-600',
    'bg-emerald-100 text-emerald-600',
    'bg-purple-100 text-purple-600'
  ];
  // Simple hash to pick a consistent color for the same name
  const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  const colorClass = colors[colorIndex];

  // Force using initials for artisans as requested (ignoring photoURL to prevent broken images)
  if (isArtisan || !photoURL || imgError) {
    return (
      <div 
        className={`flex items-center justify-center font-bold tracking-wider rounded-full shadow-sm border border-white/50 ${sizeClasses[size]} ${colorClass} ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`relative rounded-full overflow-hidden border border-gray-100 shadow-sm ${sizeClasses[size]} ${className}`}>
      <img
        src={photoURL}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
