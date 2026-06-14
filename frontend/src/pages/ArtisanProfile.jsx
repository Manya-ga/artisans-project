import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Profile from './Profile.jsx';

export default function ArtisanProfile() {
  const { id } = useParams();
  
  // Unified social experience: Artisan profiles now use the Instagram-style Profile layout
  return <Profile id={id} />;
}
