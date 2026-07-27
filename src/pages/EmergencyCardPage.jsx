import React, { useState, useEffect } from 'react';
import { emergencyApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldAlert, Heart, Phone, AlertCircle, Pill, Download, Share2 } from 'lucide-react';

export const EmergencyCardPage = () => {
  const [card, setCard] = useState(null);

  useEffect(() => {
    emergencyApi.getCard().then((res) => setCard(res.data)).catch(console.error);
  }, []);

  if (!card) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading Emergency Medical Profile...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <DisclaimerBanner />

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-500 animate-pulse" /> Emergency QR Medical Profile
        </h1>
        <p className="text-xs text-slate-500">
          Instant scannable medical ID card for first responders and ER personnel.
        </p>
      </div>

      {/* Emergency Card Component */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Patient Details */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xl border border-rose-500/30">
                {card.blood_group}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{card.user_name}</h2>
                <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">Blood Group: {card.blood_group}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Emergency Contact
                </div>
                <div className="font-bold text-slate-900 text-sm">{card.emergency_contact}</div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Known Allergies
                </div>
                <div className="font-medium text-amber-300">{card.allergies?.join(', ')}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
              <div className="text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <Pill className="w-3.5 h-3.5 text-blue-400" /> Current Prescriptions
              </div>
              <div className="text-slate-200">{card.current_medicines?.join(', ')}</div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-5 rounded-2xl shadow-glow flex flex-col items-center justify-center shrink-0">
            <QRCodeSVG value={card.qr_code_payload || 'EMERGENCY MEDICAL PROFILE'} size={170} />
            <span className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-wider">Scan for Medical ID</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCardPage;
