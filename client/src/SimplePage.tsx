import React from 'react';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-500">Nail Art Match - Basit Sayfa</h1>
      <p className="mb-4">Bu basit bir React sayfasıdır.</p>
      <a 
        href="/test.html" 
        className="inline-block bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
      >
        Statik Test Sayfasına Git
      </a>
    </div>
  );
}