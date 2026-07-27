import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Platform, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { 
  User, Bell, Shield, Moon, Globe, HelpCircle, 
  LogOut, ChevronRight, Heart, FileText, Sparkles
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const MENU_SECTIONS = [
  {
    title: 'Health',
    items: [
      { icon: Heart, label: 'Health Profile', subtitle: 'Blood type, allergies, conditions', color: '#EF4444' },
      { icon: FileText, label: 'Medical Records', subtitle: '12 documents uploaded', color: '#2563EB' },
      { icon: Sparkles, label: 'AI Insights', subtitle: 'Personalized health analysis', color: '#7C3AED' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', subtitle: 'Medicine reminders, appointments', color: '#F59E0B' },
      { icon: Moon, label: 'Appearance', subtitle: 'Light mode', color: '#06B6D4' },
      { icon: Globe, label: 'Language', subtitle: 'English', color: '#10B981' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: Shield, label: 'Privacy & Security', subtitle: 'Biometrics, data sharing', color: '#2563EB' },
      { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQ, contact us', color: '#64748B' },
    ],
  },
];

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('auth_token');
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="absolute top-[-40px] left-[-40px] w-56 h-56 bg-accent-500/10 rounded-full blur-[80px]" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-10">
          <View className="w-24 h-24 bg-brand-500/10 rounded-full items-center justify-center mb-4 border-2 border-brand-500/20">
            <User size={40} color="#2563EB" />
          </View>
          <Text className="text-2xl font-bold text-text-primary">MediTwin User</Text>
          <Text className="text-sm text-text-secondary font-medium mt-1">demo@meditwin.com</Text>
          <View className="bg-brand-500/10 px-4 py-1.5 rounded-full mt-3 border border-brand-500/20">
            <Text className="text-xs font-bold text-brand-500">Premium Plan</Text>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, sectionIndex) => (
          <Animated.View 
            key={section.title} 
            entering={FadeInUp.duration(600).delay(100 + sectionIndex * 100)}
            className="mb-6"
          >
            <Text className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">
              {section.title}
            </Text>
            <View className="bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const IconComp = item.icon;
                const isLast = itemIndex === section.items.length - 1;
                return (
                  <TouchableOpacity
                    key={item.label}
                    className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-slate-50' : ''}`}
                    activeOpacity={0.6}
                  >
                    <View className="flex-row items-center gap-4">
                      <View 
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <IconComp size={20} color={item.color} />
                      </View>
                      <View>
                        <Text className="text-sm font-bold text-text-primary">{item.label}</Text>
                        <Text className="text-[11px] text-text-secondary font-medium mt-0.5">{item.subtitle}</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color="#CBD5E1" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        ))}

        {/* Sign Out */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white rounded-3xl p-4 shadow-sm shadow-slate-200/50 border border-red-100 flex-row items-center justify-center gap-3"
            activeOpacity={0.6}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="text-sm font-bold text-red-500">Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version */}
        <Text className="text-center text-xs text-text-secondary/50 mt-6 font-medium">
          MediTwin AI v1.0.0 • Built with ❤️
        </Text>
      </ScrollView>
    </View>
  );
}
