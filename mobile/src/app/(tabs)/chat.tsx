import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, ScrollView, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatAPI } from '../../services/api';
import { Send, Mic, Image as ImageIcon, Bot, User, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Explain my latest blood test",
  "What is a normal resting heart rate?",
  "How to improve my HRV?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am MediTwin AI, your personal healthcare copilot. I can analyze your health data, explain medical reports, or answer general health questions.\n\nHow can I assist you today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in first to use the AI chatbot.');
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(text.trim(), chatId);
      const data = response.data;

      if (!chatId && data.chat_id) {
        setChatId(data.chat_id);
      }

      const botMsg: Message = {
        id: data.id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Could not connect to the AI server. Please make sure you are online.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View className="pt-14 pb-4 px-6 bg-white/80 border-b border-surface-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-brand-500/10 items-center justify-center border border-brand-500/20">
            <Bot size={20} color="#2563EB" />
          </View>
          <View>
            <Text className="text-lg font-bold text-text-primary">MediTwin AI</Text>
            <Text className="text-xs text-medical-500 font-medium">Online • Powered by Gemini</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => {
          const isBot = msg.role === 'assistant';
          return (
            <Animated.View 
              key={msg.id} 
              entering={FadeInUp.duration(400)}
              className={`flex-row mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <View className="w-8 h-8 rounded-full bg-brand-500/10 items-center justify-center mr-3 mt-1 border border-brand-500/20">
                  <Bot size={16} color="#2563EB" />
                </View>
              )}
              
              <View className={`max-w-[80%] rounded-3xl px-5 py-4 ${
                isBot 
                  ? 'bg-white shadow-sm shadow-slate-200/50 border border-slate-100 rounded-tl-none' 
                  : 'bg-brand-500 shadow-md shadow-brand-500/20 rounded-tr-none'
              }`}>
                <Text className={`text-[15px] leading-6 ${isBot ? 'text-text-primary' : 'text-white'}`}>
                  {msg.content}
                </Text>
              </View>

              {!isBot && (
                <View className="w-8 h-8 rounded-full bg-slate-200 items-center justify-center ml-3 mt-1">
                  <User size={16} color="#64748B" />
                </View>
              )}
            </Animated.View>
          );
        })}

        {isLoading && (
          <Animated.View entering={FadeInUp} className="flex-row mb-6 justify-start">
             <View className="w-8 h-8 rounded-full bg-brand-500/10 items-center justify-center mr-3 border border-brand-500/20">
                <Bot size={16} color="#2563EB" />
              </View>
              <View className="bg-white rounded-3xl rounded-tl-none px-5 py-4 shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center gap-2">
                 <ActivityIndicator size="small" color="#2563EB" />
                 <Text className="text-text-secondary text-sm font-medium">Analyzing health data...</Text>
              </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="absolute bottom-[80px] w-full bg-transparent px-4 pb-4 pt-2">
        
        {/* Suggested Prompts - Only show if few messages */}
        {messages.length < 3 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <TouchableOpacity 
                key={i}
                onPress={() => setInputText(prompt)}
                className="bg-white/90 border border-brand-500/20 px-4 py-2 rounded-full mr-2 flex-row items-center gap-2 shadow-sm shadow-brand-500/10"
              >
                <Sparkles size={14} color="#2563EB" />
                <Text className="text-xs font-semibold text-brand-600">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View className="flex-row items-end gap-2 bg-white rounded-3xl p-2 shadow-lg shadow-slate-200/50 border border-slate-100">
          <TouchableOpacity className="p-3 bg-slate-50 rounded-full">
            <ImageIcon size={22} color="#64748B" />
          </TouchableOpacity>
          
          <TextInput
            className="flex-1 max-h-32 text-[15px] text-text-primary px-2 py-3"
            placeholder="Ask MediTwin AI..."
            placeholderTextColor="#94A3B8"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          
          {inputText.trim() ? (
            <TouchableOpacity 
              onPress={() => sendMessage(inputText)}
              className="p-3 bg-brand-500 rounded-full shadow-md shadow-brand-500/30 mb-0.5"
            >
              <Send size={20} color="white" className="ml-1" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="p-3 bg-slate-50 rounded-full mb-0.5">
              <Mic size={22} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
