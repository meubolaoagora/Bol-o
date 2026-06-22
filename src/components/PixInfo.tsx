"use client";

import { useState } from "react";

interface PixInfoProps {
  pixKey: string;
  amount: number;
  qrCodeUrl?: string;
}

export function PixInfo({ pixKey, amount, qrCodeUrl }: PixInfoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-brasil-green overflow-hidden">
      <div className="bg-brasil-green text-white p-4 text-center">
        <h4 className="font-display font-bold text-lg flex items-center justify-center gap-2">
          <span>💠</span> Pagamento via PIX
        </h4>
      </div>
      
      <div className="p-6 flex flex-col items-center">
        {qrCodeUrl ? (
          <div className="w-48 h-48 bg-gray-100 rounded-lg mb-4 p-2">
            <img src={qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-48 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm text-center p-4">
            QR Code indisponível
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
          <p className="font-display font-bold text-3xl text-brasil-green-dark">
            R$ {amount.toFixed(2)}
          </p>
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-gray-700 mb-2">Chave PIX (Copia e Cola):</p>
          <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <input 
              type="text" 
              readOnly 
              value={pixKey} 
              className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-600 outline-none"
            />
            <button 
              onClick={handleCopy}
              className={`px-4 py-3 font-semibold text-sm transition-colors ${
                copied 
                  ? "bg-brasil-green text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
