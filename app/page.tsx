"use client";

import React, { useState } from 'react';
import { Zap, ShieldCheck, Headphones, Send } from 'lucide-react';
import Link from 'next/link';

// Define the structure of a chat message
interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

export default function Home() {
  // State to store the conversation history
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Bonjour ! 👋\nOù souhaitez-vous voyager ?' }
  ]);
  
  // State to store the current text in the input field
  const [inputValue, setInputValue] = useState('');
  
  // State to show the typing indicator while waiting for the API
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending the message to the backend
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1. Add user's message to the UI immediately
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, newUserMsg]);
    
    // 2. Clear input field and show loading state
    const currentInput = inputValue;
    setInputValue(''); 
    setIsLoading(true);

    try {
      // 3. Send data to the Next.js API route (Webhook bridge)
      const response = await fetch('/api/demande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Server connection error');
      }

      // 4. Receive and display the AI's response
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, sender: 'bot', text: data.reply || "Désolé, je n'ai pas pu comprendre votre demande." }
      ]);

    } catch (error) {
      console.error("Message sending error:", error);
      // Fallback message if the API fails
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, sender: 'bot', text: "Une erreur s'est produite de notre côté. Veuillez réessayer plus tard." }
      ]);
    } finally {
      // Hide loading state regardless of success or failure
      setIsLoading(false);
    }
  };

  // Function to trigger send when hitting the Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

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

        {/* CHATBOT UI */}
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
          <div className="p-6 space-y-6 bg-white h-[350px] overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <div 
                  className={`p-4 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-[#1A528A] text-white rounded-tr-none' 
                      : 'bg-[#F6F6F3] text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === 'user' && (
                    <div className="text-right mt-2 text-[10px] text-blue-200 opacity-70">✓✓ Envoyé</div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="bg-[#F6F6F3] p-4 rounded-2xl rounded-tl-none flex gap-1 items-center h-[52px]">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              placeholder="Décrivez votre projet..." 
              className="flex-1 bg-[#F6F6F3] border border-transparent focus:border-gray-300 focus:outline-none rounded-full px-6 py-3 text-sm disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-[#1A528A] text-white p-3 rounded-full hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation to Form Page */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Vous préférez un formulaire classique ?
          </p>
          <Link href="/formulaire">
            <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
              Remplir le formulaire
            </button>
          </Link>
          
          <p className="text-xs text-gray-400 pt-4">
            En continuant, vous acceptez nos CGU et notre Politique de confidentialité.
          </p>
        </div>
      </main>
    </div>
  );
}
