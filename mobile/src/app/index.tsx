import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, User, Activity, ShieldCheck, Fingerprint } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, withRepeat, withTiming, useSharedValue, useAnimatedStyle, withSequence } from 'react-native-reanimated';

import { authAPI } from '../services/api';
import { PremiumButton } from '../components/ui/PremiumButton';
import { GlassCard } from '../components/ui/GlassCard';

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  name: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    const checkInitialState = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('has_seen_onboarding');
        if (!hasSeenOnboarding) {
          router.replace('/onboarding');
          return;
        }
        
        // Also check if they are already logged in
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          router.replace('/(tabs)/dashboard');
          return;
        }
      } catch (e) {
        // Fallback
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkInitialState();

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ), 
      -1, 
      true
    );
  }, []);

  if (checkingAuth) return null;

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 1.5 - pulseScale.value
  }));

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: 'demo@meditwin.ai',
      password: 'demo1234',
      name: '',
    }
  });

  const toggleMode = () => {
    setIsRegister(!isRegister);
    reset();
  };

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      let response;
      if (isRegister) {
        if (!data.name?.trim()) {
          alert('Please enter your name to register.');
          setLoading(false);
          return;
        }
        response = await authAPI.register(data.name, data.email, data.password);
      } else {
        response = await authAPI.login(data.email, data.password);
      }

      const { access_token } = response.data;
      if (access_token) {
        await AsyncStorage.setItem('auth_token', access_token);
        router.replace('/(tabs)/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Authentication failed. Please check your credentials.');
      // Fallback for demo
      router.replace('/(tabs)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-surface"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
        {/* Animated Background Orbs */}
        <Animated.View style={animatedPulse} className="absolute -top-32 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]" />
        <Animated.View style={animatedPulse} className="absolute top-40 -right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px]" />

        <View className="flex-1 justify-center px-6 pt-16 pb-8">
          
          <Animated.View entering={FadeInDown.delay(200).duration(1000)} className="items-center mb-10">
            <View className="w-16 h-16 rounded-3xl bg-white items-center justify-center shadow-lg shadow-brand-500/20 mb-4 border border-brand-500/10">
              <Activity size={32} color="#2563EB" strokeWidth={2.5} />
            </View>
            <Text className="text-3xl font-bold text-text-primary mb-1">
              MediTwin<Text className="text-brand-500">AI</Text>
            </Text>
            <Text className="text-sm text-text-secondary font-medium">Your Personal AI Healthcare Companion</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(800)}>
            <GlassCard intensity={80} className="p-6 pt-8">
              <Text className="text-xl font-bold text-text-primary mb-6 text-center">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </Text>

              <View className="space-y-4 mb-6">
                
                {isRegister && (
                  <View>
                    <View className="flex-row items-center bg-surface border border-surface-border rounded-2xl px-4 py-1 h-14">
                      <User size={20} color="#94A3B8" />
                      <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                          <TextInput 
                            placeholder="Full Name"
                            placeholderTextColor="#94A3B8"
                            className="flex-1 ml-3 text-text-primary font-medium"
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                      />
                    </View>
                  </View>
                )}

                <View>
                  <View className="flex-row items-center bg-surface border border-surface-border rounded-2xl px-4 py-1 h-14">
                    <Mail size={20} color="#94A3B8" />
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, value } }) => (
                        <TextInput 
                          placeholder="Email Address"
                          placeholderTextColor="#94A3B8"
                          className="flex-1 ml-3 text-text-primary font-medium"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                  {errors.email && <Text className="text-xs text-red-500 mt-1 ml-2">{errors.email.message}</Text>}
                </View>

                <View>
                  <View className="flex-row items-center bg-surface border border-surface-border rounded-2xl px-4 py-1 h-14">
                    <Lock size={20} color="#94A3B8" />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <TextInput 
                          placeholder="Password"
                          placeholderTextColor="#94A3B8"
                          className="flex-1 ml-3 text-text-primary font-medium"
                          secureTextEntry={!showPassword}
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                      {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text className="text-xs text-red-500 mt-1 ml-2">{errors.password.message}</Text>}
                </View>

              </View>

              {!isRegister && (
                <View className="flex-row justify-end mb-6">
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-brand-500">Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <PremiumButton 
                title={isRegister ? 'Sign Up' : 'Sign In'} 
                onPress={handleSubmit(onSubmit)} 
                loading={loading}
              />

              {!isRegister && (
                <TouchableOpacity className="mt-4 flex-row justify-center items-center gap-2 h-14 rounded-2xl bg-surface border border-surface-border">
                  <Fingerprint size={20} color="#2563EB" />
                  <Text className="text-sm font-semibold text-text-primary">Biometric Login</Text>
                </TouchableOpacity>
              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-slate-200" />
                <Text className="mx-4 text-text-secondary font-medium">OR CONTINUE WITH</Text>
                <View className="flex-1 h-[1px] bg-slate-200" />
              </View>

              {/* Social Logins */}
              <View className="flex-row gap-4 mb-8">
                <TouchableOpacity 
                  onPress={() => alert('Google Sign-In requires Google Cloud Console configuration. Add your Client ID to proceed.')}
                  className="flex-1 bg-white border border-slate-200 py-3 rounded-2xl flex-row justify-center items-center gap-2 shadow-sm shadow-slate-100"
                >
                  {/* Simple G logo placeholder */}
                  <View className="w-5 h-5 rounded-full bg-red-500 items-center justify-center">
                    <Text className="text-white font-bold text-xs">G</Text>
                  </View>
                  <Text className="text-text-primary font-bold">Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => alert('OTP Verification: Enter a phone number first.')}
                  className="flex-1 bg-white border border-slate-200 py-3 rounded-2xl flex-row justify-center items-center gap-2 shadow-sm shadow-slate-100"
                >
                  <Fingerprint size={20} color="#0F172A" />
                  <Text className="text-text-primary font-bold">OTP / Phone</Text>
                </TouchableOpacity>
              </View>

              {/* Toggle Mode */}
              <TouchableOpacity onPress={toggleMode} className="mt-4 pb-8 items-center">
                <Text className="text-text-secondary">
                  {isRegister ? "Already have an account? " : "New to MediTwin? "}
                  <Text className="text-brand-600 font-bold">
                    {isRegister ? "Sign In" : "Create Account"}
                  </Text>
                </Text>
              </TouchableOpacity>
              
              {/* Secure Login Pill */}
              <View className="mt-8 flex-row items-center justify-center gap-2 bg-green-500/10 self-center px-4 py-2 rounded-full">
                <ShieldCheck size={16} color="#10B981" />
                <Text className="text-xs font-semibold text-medical-500">Protected with JWT Encryption</Text>
              </View>

            </GlassCard>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
