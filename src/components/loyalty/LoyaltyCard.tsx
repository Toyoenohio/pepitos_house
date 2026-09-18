import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface MemberData {
  email: string;
  name: string;
  phone: string;
  currentStamps: number;
  totalStamps: number;
  cardsCompleted: number;
}

export default function LoyaltyCard() {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('ph251_member_email');
    if (savedEmail) {
      setEmailInput(savedEmail);
      fetchMember(savedEmail);
    }
  }, []);

  async function fetchMember(email: string) {
    if (!email.trim()) return;
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/loyalty?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.member) {
          setMember(data.member);
          localStorage.setItem('ph251_member_email', data.member.email);
          if (data.member.currentStamps >= 10) {
            confetti();
          }
        } else {
          setMember(null);
          setMessage('Aoun no tienes una tarjeta registrada. ¡Ingresa tus datos abajo para crearla gratis!');
        }
      } else {
        setMember(null);
        setMessage('Aoun no tienes una tarjeta registrada. ¡Ingresa tus datos abajo para crearla gratis!');
      }
    } catch (err) {
      // Local fallback if DB not yet connected
      setMember({
        email,
        name: localStorage.getItem('ph251_member_name') || 'Cliente Guago',
        phone: localStorage.getItem('ph251_member_phone') || '04xx',
        currentStamps: 3,
        totalStamps: 3,
        cardsCompleted: 0
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !nameInput.trim()) {
      setMessage('Por favor completa tu nombre y correo.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          name: nameInput,
          phone: phoneInput || 'N/A'
        })
      });
      const data = await res.json();
      if (data.member) {
        setMember(data.member);
        localStorage.setItem('ph251_member_email', data.member.email);
      }
    } catch (err) {
      setMember({
        email: emailInput,
        name: nameInput,
        phone: phoneInput || 'N/A',
        currentStamps: 0,
        totalStamps: 0,
        cardsCompleted: 0
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Render 10 slots
  const stampsCount = member ? Math.min(member.currentStamps, 10) : 0;
  const stampsArray = Array.from({ length: 10 }, (_, i) => i < stampsCount);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-white text-black text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-black shadow-brutal uppercase">
          🞧 Club Guaro 251
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
          Tarjeta de Sellos Digital
        </h1>
        <p className="text-sm font-semibold text-black/80 max-w-md mx-auto">
          Acumula 1 sello por cada pedido completado. ¡Al completar 10 sellos te regalamos 1 Pepito Tradicional gratis!
        </p>
      </div>

      {/* Tarjeta Fisíca Skeuomorphic */}
      <div className="relative bg-brandYellow rounded-3xl border-4 border-black shadow-brutal-lg p-6 sm:p-8 overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-black/5 border-2 border-black/10"></div>

        {/* Card Top Bar */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">👶</span>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase leading-none">PEPITOS HOUSE 251</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/70">Pasaporte Guaro</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block bg-black text-white font-display font-black text-xs sm:text-sm px-3 py-1 rounded-full border-2 border-black">
              {stampsCount} / 10 SELLOS
            </span>
          </div>
        </div>

        {/* Stamps Grid (2x5) */}
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 sm:gap-4 my-6">
          {stampsArray.map((earned, index) => (
            <div 
              key={index} 
              className={`aspect-square rounded-2xl border-3 border-black flex flex-col items-center justify-center p-1 transition-all ${earned ? 'bg-brandBlue text-white shadow-brutal' : 'bg-white/60 border-dashed'}`}
            >
              {earned ? (
                <div className="transform -rotate-12 flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl">👹</span>
                  <span className="text-[8px] font-display font-black uppercase">SELLO</span>
                </div>
            ) : index === 9 ? (
                <div className="text-center">
                  <span className="text-2xl">🍸</span>
                  <span className="block text-[8px] font-black uppercase">GRATIS</span>
                </div>
            ) : (
                <span className="font-display font-black text-sm sm:text-base text-black/30">
                  {index + 1}
                </span>
            )}
            </div>
          ))}
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-2 border-t-2 border-black/p15 pt-4">
          <div className="w-full bg-white rounded-full border-2 border-black h-4 overflow-hidden p-0.5">
            <div 
              className="h-full bg-brandBlue rounded-full transition-all duration-500"
              style={{ width: `${(stampsCount / 10) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            {stampsCount >= 10 ? (
              <span className="text-emerald-800 font-extrabold">🍉 ¡FELICIDADES! Ya tienes tu pepito gratis disponible.</span>
            ) : (
              <span>⌝ Faltan { 10 - stampsCount } sellos para tu regalo guaro.</span>
            )}
            {member && <span className="text-black/70">Id: {member.email}</span>}
          </div>
        </div>
      </div>

      {/* Identification Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-black shadow-brutal space-y-5">
        <div>
          <h3 className="font-display font-black text-xl uppercase">Consulta o Activa tu Pasaporte</h3>
          <p className="text-xs text-gray-600 mt-1">
            Ingresa tu correo electrónico para ver tus sellos acuales o registrarte al momento.
          </p>
        </div>

        <form onSubmit={(ev) => { ev.preventDefault(); fetchMember(emailInput); }} className="flex gap-2">
          <input 
            type="email" 
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            placeholder="tucorreo@ejemplo.com"
            className="flex-1 bg-brandPillBg border-2 border-black rounded-full py-2.5 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-black text-white font-display font-black text-xs px-5 py-2.5 rounded-full border-2 border-black shadow-brutal hover:bg-brandBlue transition uppercase"
          >
            {isLoading ? 'Buscando...' : 'Consultar'}
          </button>
        </form>

        {message && (
          <div className="p-3 bg-brandPillBg border-2 border-black rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {!member && (message || !emailInput) && (
          <form onSubmit={handleCreateMember} className="space-y-3 pt-3 border-t-2 border-black/10">
            <h4 className="font-display font-black text-sm uppercase">¿Aún no estás registrado? ¡Empieza a acumular!</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                placeholder="Tu Nombre"
                className="bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-xs font-semibold"
              />
              <input 
                type="tel" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Teléfono (WhatsApp)"
                className="bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-xs font-semibold"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-brandBlue text-white font-display font-black text-xs py-2.5 rounded-full border-2 border-black shadow-brutal hover:bg-brandBlueDark uppercase"
            >
              CREAR MI PASAPORTE GRATIS
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
