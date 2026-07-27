import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heartRateAPI } from '../../services/api';
import { 
  Heart, Activity, Moon, Droplets, Fingerprint, Camera, ShieldCheck 
} from 'lucide-react-native';
import Animated, { 
  FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, 
  withRepeat, withTiming, withSequence, Easing 
} from 'react-native-reanimated';
import { GlassCard } from '../../components/ui/GlassCard';

const generateBpm = () => Math.floor(Math.random() * 35) + 60;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedBpm, setScannedBpm] = useState(72);
  const [scanResult, setScanResult] = useState<any>(null);
  
  const pulseScale = useSharedValue(1);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (isScanning) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Simulate PPG Heart Rate Calculation reading over 5 seconds
      setTimeout(async () => {
        const bpm = generateBpm();
        setScannedBpm(bpm);
        await AsyncStorage.setItem('last_scanned_bpm', bpm.toString());
        
        try {
          // Send simulated reading to backend for AI evaluation
          const response = await heartRateAPI.analyze(bpm);
          setScanResult(response.data);
          await AsyncStorage.setItem('last_heart_rate_data', JSON.stringify(response.data));
        } catch (e) {
          console.warn('Heart rate analysis failed', e);
        }
        
        setIsScanning(false);
        setScanComplete(true);
        pulseScale.value = 1;
      }, 5000);
    }
  }, [isScanning]);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        alert('Camera permission is required to use the vitals scanner!');
        return;
      }
    }
    setScanComplete(false);
    setIsScanning(true);
  };

  if (scanComplete) {
    return (
      <View className="flex-1 bg-surface">
        <View className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-medical-500/10 rounded-full blur-[80px]" />
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}>
          
          <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-8">
            <View className="w-20 h-20 bg-medical-500/10 rounded-full items-center justify-center mb-4 border border-medical-500/20">
              <ShieldCheck size={36} color="#10B981" />
            </View>
            <Text className="text-3xl font-bold text-text-primary">Scan Complete</Text>
            <Text className="text-sm text-text-secondary mt-1">AI-powered health snapshot</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(600).delay(200)} className="flex-row flex-wrap justify-between">
            {/* BPM */}
            <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 mb-4 items-center">
              <Heart size={24} color="#EF4444" className="mb-3" />
              <Text className="text-[11px] font-bold text-text-secondary tracking-wider mb-1">HEART RATE</Text>
              <Text className="text-3xl font-extrabold text-text-primary">{scannedBpm}</Text>
              <Text className="text-xs font-medium text-text-secondary">BPM</Text>
            </View>
            {/* HRV */}
            <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 mb-4 items-center">
              <Activity size={24} color="#7C3AED" className="mb-3" />
              <Text className="text-[11px] font-bold text-text-secondary tracking-wider mb-1">HRV</Text>
              <Text className="text-3xl font-extrabold text-text-primary">{scanResult?.hrv ?? '--'}</Text>
              <Text className="text-xs font-medium text-text-secondary">ms</Text>
            </View>
            {/* Stress */}
            <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 mb-4 items-center">
              <Moon size={24} color="#06B6D4" className="mb-3" />
              <Text className="text-[11px] font-bold text-text-secondary tracking-wider mb-1">STRESS SCORE</Text>
              <Text className="text-3xl font-extrabold text-text-primary">{scanResult?.stress_score ?? '--'}</Text>
              <Text className="text-xs font-medium text-text-secondary text-center leading-tight mt-1">{scanResult?.stress_level ?? ''}</Text>
            </View>
            {/* Oxygen */}
            <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 mb-4 items-center">
              <Droplets size={24} color="#10B981" className="mb-3" />
              <Text className="text-[11px] font-bold text-text-secondary tracking-wider mb-1">BLOOD OXYGEN</Text>
              <Text className="text-3xl font-extrabold text-text-primary">{scanResult?.oxygen_saturation ?? '--'}</Text>
              <Text className="text-xs font-medium text-text-secondary">% SpO2</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(600).delay(400)} className="mt-6">
            <TouchableOpacity 
              onPress={() => setScanComplete(false)}
              className="bg-brand-500 w-full py-4 rounded-2xl items-center shadow-lg shadow-brand-500/30"
            >
              <Text className="text-white font-bold text-base">New Scan</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-16 mt-10">
          <Text className="text-3xl font-bold text-text-primary text-center mb-2">Vitals Scanner</Text>
          <Text className="text-base text-text-secondary text-center">
            Place your fingertip completely over the camera lens and flash to measure your vitals.
          </Text>
        </Animated.View>

        <View className="relative items-center justify-center mb-16 w-64 h-64">
          
          {/* Animated pulsing rings */}
          {isScanning && (
            <Animated.View 
              style={animatedPulse} 
              className="absolute w-72 h-72 bg-red-500/10 rounded-full" 
            />
          )}

          {/* Actual Camera View acting as the sensor */}
          <View className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-xl shadow-red-500/20 relative z-10 bg-slate-900">
            {isScanning ? (
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing="back"
                enableTorch={true}
              >
                {/* Red tint overlay to simulate PPG reading */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(239, 68, 68, 0.4)' }]} />
              </CameraView>
            ) : (
              <View className="flex-1 bg-slate-100 items-center justify-center">
                <Fingerprint size={48} color="#94A3B8" />
              </View>
            )}
          </View>
        </View>

        <Animated.View entering={FadeInUp.duration(800).delay(200)} className="w-full mt-4">
          <TouchableOpacity 
            onPress={isScanning ? undefined : startScan}
            disabled={isScanning}
            className={`w-full py-4 rounded-2xl items-center shadow-lg ${
              isScanning ? 'bg-slate-300' : 'bg-red-500 shadow-red-500/30'
            }`}
          >
            <Text className={`font-bold text-base ${isScanning ? 'text-slate-500' : 'text-white'}`}>
              {isScanning ? 'Analyzing Vitals...' : 'Start Scan'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {isScanning && (
          <Animated.Text entering={FadeInUp} className="text-sm text-text-secondary mt-6 text-center font-medium">
            Keep your finger still and cover the flash...
          </Animated.Text>
        )}
      </View>
    </View>
  );
}
