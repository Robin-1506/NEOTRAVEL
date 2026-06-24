import React from 'react';
import { Zap, ShieldCheck, Headphones, Send, User } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="font-bold text-xl tracking-tight">Neotravel</div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-gray-900">Services</a>
          <a href="#" className="hover:text-gray-900">À propos</a>
          <a href="#" className="hover:text-gray-900">Contact</a>
        </nav>
        <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
          Se connecter
        </button>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Votre autocar, <br /> en quelques minutes.
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Décrivez simplement votre voyage. Notre assistant vous aide<br/> à obtenir un devis rapidement et sans engagement.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-[#F6F6F3] p-6 rounded-2xl text-center flex flex-col items-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Réponse rapide</h3>
            <p className="text-xs text-gray-500">Devis en quelques min.</p>
          </div>
          <div className="bg-[#F6F6F3] p-6 rounded-2xl text-center flex flex-col items-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <ShieldCheck className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Fiable & sécurisé</h3>
            <p className="text-xs text-gray-500">Données protégées</p>
          </div>
          <div className="bg-[#F6F6F3] p-6 rounded-2xl text-center flex flex-col items-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <Headphones className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Conseiller humain</h3>
            <p className="text-xs text-gray-500">Disponible si besoin</p>
          </div>
        </div>

        {/* CHATBOT UI (Static pour l'instant) */}
        <div className="mt-16 max-w-3xl mx-auto border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Chat Header */}
          <div className="bg-[#F1F4EB] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#1A528A] rounded-full flex items-center justify-center text-white text-xs font-bold">
              IA
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Assistant Neotravel</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-600">En ligne</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-6 bg-white min-h-[300px]">
            {/* Bot Message */}
            <div className="flex items-start gap-3">
              <div className="bg-[#F6F6F3] text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                <p>Bonjour ! 👋</p>
                <p className="mt-2">Où souhaitez-vous voyager ?</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-[#1A528A] text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                <p>Nous sommes 45 personnes et souhaitons aller de Lyon à Paris le 12 juillet.</p>
                <div className="text-right mt-2 text-xs text-blue-200">✓✓ 10:49</div>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex items-start gap-3">
              <div className="bg-[#F6F6F3] p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Décrivez votre projet..." 
              className="flex-1 bg-[#F6F6F3] border border-transparent focus:border-gray-300 focus:outline-none rounded-full px-6 py-3 text-sm"
            />
            <button className="bg-[#1A528A] text-white p-3 rounded-full hover:bg-blue-800 transition">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">En continuant, vous acceptez nos CGU et notre Politique de confidentialité.</p>
        </div>
      </main>
    </div>
  );
}
