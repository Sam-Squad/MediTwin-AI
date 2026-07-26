import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { User, Shield, Moon, Sun, Globe, Bell, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergency_contact || '');
  const [allergies, setAllergies] = useState(user?.allergies?.join(', ') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      blood_group: bloodGroup,
      emergency_contact: emergencyContact,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <DisclaimerBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" /> User Profile & Application Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage health credentials, notification settings, and display theme.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
            Profile preferences updated successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Known Allergies (Comma Separated)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-glow flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Save Profile Preferences
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Theme & Display Settings</h3>
          <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <div className="font-semibold text-xs text-white">Appearance Theme</div>
                <div className="text-[11px] text-slate-400">Current mode: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700"
            >
              Toggle Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
