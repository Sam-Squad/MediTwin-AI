import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  Linking, Platform, Alert 
} from 'react-native';
import { 
  AlertTriangle, Phone, Heart, Droplets, 
  Pill, ShieldAlert, User, MapPin, Siren
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const EMERGENCY_DATA = {
  name: 'MediTwin User',
  bloodType: 'O Negative (O-)',
  allergies: ['Penicillin', 'Peanuts'],
  conditions: ['Asthma'],
  medications: ['Albuterol Inhaler', 'Cetirizine 10mg'],
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+1 (555) 019-8372',
    relation: 'Spouse',
  },
  insuranceId: 'MEDI-2025-7842',
  organDonor: true,
};

export default function EmergencyScreen() {
  const callEmergency = (number: string) => {
    const url = `tel:${number.replace(/\D/g, '')}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Cannot make call', 'Phone dialer is not available on this device.');
      }
    });
  };

  return (
    <View className="flex-1 bg-surface">
      {/* Red ambient glow */}
      <View className="absolute top-[-60px] right-[-40px] w-72 h-72 bg-red-500/10 rounded-full blur-[100px]" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-8">
          <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center mb-4 border-2 border-red-500/20">
            <ShieldAlert size={36} color="#EF4444" />
          </View>
          <Text className="text-3xl font-bold text-text-primary">Emergency</Text>
          <Text className="text-sm text-text-secondary font-medium mt-1 text-center">
            Critical medical info for first responders
          </Text>
        </Animated.View>

        {/* SOS Button */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <TouchableOpacity
            onPress={() => callEmergency('911')}
            className="bg-red-500 w-full py-5 rounded-3xl items-center justify-center flex-row gap-3 shadow-xl shadow-red-500/30 mb-8"
            activeOpacity={0.8}
          >
            <Siren size={24} color="white" />
            <Text className="text-white text-lg font-bold">Call Emergency (911)</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Medical ID Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} className="mb-6">
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">Medical ID</Text>
          <View className="bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
            
            <View className="flex-row items-center justify-between p-5 border-b border-slate-50">
              <View className="flex-row items-center gap-3">
                <User size={18} color="#64748B" />
                <Text className="text-sm text-text-secondary font-medium">Full Name</Text>
              </View>
              <Text className="text-sm font-bold text-text-primary">{EMERGENCY_DATA.name}</Text>
            </View>

            <View className="flex-row items-center justify-between p-5 border-b border-slate-50">
              <View className="flex-row items-center gap-3">
                <Droplets size={18} color="#EF4444" />
                <Text className="text-sm text-text-secondary font-medium">Blood Type</Text>
              </View>
              <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <Text className="text-sm font-bold text-red-600">{EMERGENCY_DATA.bloodType}</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between p-5 border-b border-slate-50">
              <View className="flex-row items-center gap-3">
                <AlertTriangle size={18} color="#F59E0B" />
                <Text className="text-sm text-text-secondary font-medium">Allergies</Text>
              </View>
              <View className="flex-row gap-2">
                {EMERGENCY_DATA.allergies.map((a) => (
                  <View key={a} className="bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    <Text className="text-xs font-bold text-amber-700">{a}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-between p-5 border-b border-slate-50">
              <View className="flex-row items-center gap-3">
                <Heart size={18} color="#7C3AED" />
                <Text className="text-sm text-text-secondary font-medium">Conditions</Text>
              </View>
              <Text className="text-sm font-bold text-text-primary">
                {EMERGENCY_DATA.conditions.join(', ')}
              </Text>
            </View>

            <View className="flex-row items-center justify-between p-5">
              <View className="flex-row items-center gap-3">
                <Pill size={18} color="#10B981" />
                <Text className="text-sm text-text-secondary font-medium">Medications</Text>
              </View>
              <View className="items-end">
                {EMERGENCY_DATA.medications.map((m) => (
                  <Text key={m} className="text-xs font-semibold text-text-primary">{m}</Text>
                ))}
              </View>
            </View>

          </View>
        </Animated.View>

        {/* Emergency Contact */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)} className="mb-6">
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">Emergency Contact</Text>
          <TouchableOpacity 
            onPress={() => callEmergency(EMERGENCY_DATA.emergencyContact.phone)}
            activeOpacity={0.7}
            className="bg-white rounded-3xl p-5 shadow-sm shadow-slate-200/50 border border-brand-500/20 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-brand-500/10 rounded-full items-center justify-center">
                <Phone size={22} color="#2563EB" />
              </View>
              <View>
                <Text className="text-base font-bold text-text-primary">{EMERGENCY_DATA.emergencyContact.name}</Text>
                <Text className="text-sm text-text-secondary font-medium">{EMERGENCY_DATA.emergencyContact.phone}</Text>
                <Text className="text-xs text-brand-500 font-semibold mt-0.5">{EMERGENCY_DATA.emergencyContact.relation}</Text>
              </View>
            </View>
            <View className="bg-brand-500 w-10 h-10 rounded-full items-center justify-center shadow-md shadow-brand-500/30">
              <Phone size={18} color="white" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Additional Info */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">Additional</Text>
          <View className="bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <View className="flex-row items-center justify-between p-5 border-b border-slate-50">
              <Text className="text-sm text-text-secondary font-medium">Insurance ID</Text>
              <Text className="text-sm font-bold text-text-primary">{EMERGENCY_DATA.insuranceId}</Text>
            </View>
            <View className="flex-row items-center justify-between p-5">
              <Text className="text-sm text-text-secondary font-medium">Organ Donor</Text>
              <View className={`px-3 py-1 rounded-full ${EMERGENCY_DATA.organDonor ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100'}`}>
                <Text className={`text-xs font-bold ${EMERGENCY_DATA.organDonor ? 'text-green-600' : 'text-slate-500'}`}>
                  {EMERGENCY_DATA.organDonor ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
