import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Activity, Pill, Calendar, FileText, ChevronRight, 
  Sparkles, Heart, Droplets, Moon, Flame
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, FadeInUp, useSharedValue, useAnimatedProps, 
  withTiming, Easing
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { healthAPI } from '../../services/api';
import { GlassCard } from '../../components/ui/GlassCard';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface HealthSummary {
  user_name: string;
  overall_health_score: number;
  adherence_percentage: number;
  active_medicines: string[];
  key_abnormalities: string[];
  lifestyle_suggestions: string[];
}

export default function DashboardScreen() {
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [lastBpm, setLastBpm] = useState<number | null>(null);
  const [heartData, setHeartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useSharedValue(0);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const storedBpm = await AsyncStorage.getItem('last_scanned_bpm');
      if (storedBpm) setLastBpm(parseInt(storedBpm, 10));

      const storedHeart = await AsyncStorage.getItem('last_heart_rate_data');
      if (storedHeart) setHeartData(JSON.parse(storedHeart));

      const res = await healthAPI.getSummary();
      setSummary(res.data);
      
      // Animate score
      if (res.data?.overall_health_score) {
        progress.value = withTiming(res.data.overall_health_score / 100, {
          duration: 1500,
          easing: Easing.out(Easing.cubic)
        });
      }
    } catch (err: any) {
      setError(err?.response?.status === 401 ? 'Sign in to see your real health data.' : 'Could not connect to server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    progress.value = 0; // reset for re-animation
    fetchData();
  };

  const userName = summary?.user_name ?? 'Guest';
  const healthScore = summary?.overall_health_score ?? 0;
  const nextMed = summary?.active_medicines?.[0] ?? 'No upcoming medicines';
  const bpm = lastBpm ?? '--';
  const hrv = heartData?.hrv ?? '--';
  const stress = heartData?.stress_level ?? '--';

  // Circular Progress Props
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - progress.value * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View className="flex-1 bg-surface">
      {/* Ambient Top Glow */}
      <View className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {/* Header Greeting */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)} className="px-6 mb-6">
          <Text className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-1">Good Morning</Text>
          <Text className="text-3xl font-bold text-text-primary">Hello, {userName}</Text>
        </Animated.View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-text-secondary mt-4">Loading your health twin...</Text>
          </View>
        ) : (
          <>
            {error && (
              <View className="mx-6 mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                <Text className="text-red-500 text-center text-sm font-medium">{error}</Text>
              </View>
            )}

            {/* Health Score Ring */}
            <Animated.View entering={FadeInUp.duration(800).delay(200)} className="px-6 mb-6">
              <GlassCard className="items-center py-8 relative overflow-hidden">
                <View className="absolute top-0 right-0 w-32 h-32 bg-medical-500/10 rounded-full blur-3xl" />
                
                <Text className="text-sm font-bold text-text-secondary mb-6 tracking-wide">AI HEALTH SCORE</Text>
                
                <View className="relative items-center justify-center">
                  <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
                    <Circle
                      cx={radius + strokeWidth / 2}
                      cy={radius + strokeWidth / 2}
                      r={radius}
                      stroke="#E2E8F0"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <AnimatedCircle
                      cx={radius + strokeWidth / 2}
                      cy={radius + strokeWidth / 2}
                      r={radius}
                      stroke="#10B981"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={circumference}
                      animatedProps={animatedProps}
                      strokeLinecap="round"
                      transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
                    />
                  </Svg>
                  <View className="absolute items-center justify-center">
                    <Text className="text-4xl font-extrabold text-text-primary">{healthScore}</Text>
                    <Text className="text-xs text-text-secondary font-medium">/ 100</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mt-6 bg-brand-500/5 px-4 py-2 rounded-full border border-brand-500/10">
                  <Sparkles size={16} color="#2563EB" />
                  <Text className="text-xs font-semibold text-brand-500">
                    {healthScore >= 80 ? "Optimal health! Keep it up." : "Needs minor lifestyle adjustments."}
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>

            {/* Daily Wellness Mini Cards */}
            <Animated.View entering={FadeInUp.duration(800).delay(300)} className="px-6 mb-6 flex-row justify-between">
              <View className="bg-white w-[30%] p-4 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 items-center">
                <Heart size={20} color="#EF4444" className="mb-2" />
                <Text className="text-[10px] text-text-secondary font-medium mb-1">HEART RATE</Text>
                <Text className="text-lg font-bold text-text-primary">{bpm}</Text>
              </View>
              <View className="bg-white w-[30%] p-4 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 items-center">
                <Activity size={20} color="#06B6D4" className="mb-2" />
                <Text className="text-[10px] text-text-secondary font-medium mb-1">HRV</Text>
                <Text className="text-lg font-bold text-text-primary">{hrv}</Text>
              </View>
              <View className="bg-white w-[30%] p-4 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 items-center">
                <Flame size={20} color="#F59E0B" className="mb-2" />
                <Text className="text-[10px] text-text-secondary font-medium mb-1">STRESS</Text>
                <Text className="text-lg font-bold text-text-primary">{stress}</Text>
              </View>
            </Animated.View>

            {/* Action Cards */}
            <Animated.View entering={FadeInUp.duration(800).delay(400)} className="px-6 space-y-4">
              
              <TouchableOpacity className="bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-medical-500/10 rounded-2xl items-center justify-center">
                    <Pill size={24} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-text-primary mb-1">Next Medicine</Text>
                    <Text className="text-xs text-text-secondary font-medium">{nextMed}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-accent-500/10 rounded-2xl items-center justify-center">
                    <Calendar size={24} color="#7C3AED" />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-text-primary mb-1">Upcoming Visit</Text>
                    <Text className="text-xs text-text-secondary font-medium">Dr. Smith - Tomorrow 10 AM</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-white p-5 rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-cyan-500/10 rounded-2xl items-center justify-center">
                    <FileText size={24} color="#06B6D4" />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-text-primary mb-1">Recent Report</Text>
                    <Text className="text-xs text-text-secondary font-medium">Complete Blood Count (CBC)</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>

            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
