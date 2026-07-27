import React, { useRef, useState } from 'react';
import { 
  View, Text, ScrollView, Dimensions, 
  NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrainCircuit, Activity, ShieldAlert, Sparkles, HeartPulse, ChevronRight } from 'lucide-react-native';
import Animated, { 
  FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, 
  withSpring, interpolate, Extrapolation 
} from 'react-native-reanimated';
import { PremiumButton } from '../components/ui/PremiumButton';
import { GlassCard } from '../components/ui/GlassCard';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Your Digital AI Twin',
    description: 'Upload your medical reports and let MediTwin AI analyze your health in real-time.',
    icon: BrainCircuit,
    color: '#2563EB',
    bgGlow: 'bg-brand-500/10',
  },
  {
    id: '2',
    title: 'Vitals Scanner',
    description: 'Measure your heart rate, HRV, and stress levels using just your phone\'s camera.',
    icon: Activity,
    color: '#10B981',
    bgGlow: 'bg-medical-500/10',
  },
  {
    id: '3',
    title: 'Emergency Ready',
    description: 'Instantly share your Medical ID, allergies, and critical conditions with first responders.',
    icon: ShieldAlert,
    color: '#EF4444',
    bgGlow: 'bg-red-500/10',
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('has_seen_onboarding', 'true');
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-surface relative overflow-hidden">
      {/* Dynamic Background Glow based on current slide */}
      <View className={`absolute top-[-50px] left-[-50px] w-96 h-96 rounded-full blur-[100px] ${SLIDES[currentIndex].bgGlow}`} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {SLIDES.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <View key={slide.id} style={{ width, height }} className="items-center justify-center px-8">
              
              <Animated.View entering={FadeInDown.duration(800).delay(100)} className="mb-12 relative items-center justify-center w-full">
                {/* Decorative floating elements */}
                {index === 0 && (
                  <View className="absolute -top-10 -right-4 p-3 bg-white/60 rounded-full border border-white">
                    <Sparkles size={24} color={slide.color} />
                  </View>
                )}
                {index === 1 && (
                  <View className="absolute -top-10 -left-4 p-3 bg-white/60 rounded-full border border-white">
                    <HeartPulse size={24} color={slide.color} />
                  </View>
                )}

                <GlassCard className="w-48 h-48 rounded-[40px] items-center justify-center shadow-premium relative">
                  <View className="absolute inset-0 bg-white/40 rounded-[40px]" />
                  <Icon size={80} color={slide.color} />
                </GlassCard>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(800).delay(200)} className="items-center w-full">
                <Text className="text-3xl font-extrabold text-text-primary text-center tracking-tight mb-4">
                  {slide.title}
                </Text>
                <Text className="text-base text-text-secondary text-center leading-relaxed">
                  {slide.description}
                </Text>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Area */}
      <View className="absolute bottom-12 w-full px-8 pb-8">
        
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-8 gap-2">
          {SLIDES.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
              );
              const dotWidth = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [8, 24, 8],
                Extrapolation.CLAMP
              );
              return { opacity, width: dotWidth };
            });

            return (
              <Animated.View
                key={index}
                style={[
                  { height: 8, borderRadius: 4, backgroundColor: SLIDES[currentIndex].color },
                  animatedDotStyle,
                ]}
              />
            );
          })}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between items-center h-14">
          {currentIndex < SLIDES.length - 1 ? (
            <>
              <TouchableOpacity onPress={finishOnboarding} className="px-4 py-2">
                <Text className="text-sm font-bold text-text-secondary">Skip</Text>
              </TouchableOpacity>
              <PremiumButton onPress={nextSlide} className="px-8 !py-3.5">
                Next
              </PremiumButton>
            </>
          ) : (
            <Animated.View entering={FadeInDown.duration(400)} className="w-full">
              <PremiumButton onPress={finishOnboarding} className="w-full !py-4 shadow-glow">
                Get Started
              </PremiumButton>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}
