import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

// Basit bir statik sayfa
export function SimpleApp() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white p-6">
        <h1 className="text-2xl font-bold mb-4 text-pink-500">Nail Art Match - Basit Sayfa</h1>
        <p className="mb-4">Bu basit bir React sayfasıdır.</p>
        
        <div className="flex flex-col space-y-4 mb-6">
          <a 
            href="/test.html" 
            className="inline-block bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 w-fit"
          >
            Statik Test Sayfasına Git
          </a>
          
          <a 
            href="/" 
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 w-fit"
          >
            Ana Sayfaya Git
          </a>
        </div>
        
        <div className="p-4 bg-gray-100 rounded-lg mb-4">
          <h2 className="font-bold mb-2">Sayfa Bilgileri</h2>
          <p>Yüklenme Zamanı: {new Date().toLocaleTimeString()}</p>
          <p>Tarayıcı: {navigator.userAgent}</p>
        </div>
        
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Sayfayı Yenile
        </button>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default SimpleApp;