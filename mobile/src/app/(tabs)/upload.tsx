import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  FileText, Image as ImageIcon, Camera, CheckCircle2, 
  XCircle, Loader2, UploadCloud, ChevronRight
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';

import { uploadAPI } from '../../services/api';
import { GlassCard } from '../../components/ui/GlassCard';

interface UploadItem {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

export default function UploadScreen() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const checkAuth = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      alert('Please sign in first to upload files.');
      return false;
    }
    return true;
  };

  const updateStatus = (id: string, status: UploadItem['status']) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const uploadMedicalPDF = async () => {
    if (!(await checkAuth())) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const file = result.assets[0];
      
      const newItem: UploadItem = {
        id: Date.now().toString(),
        name: file.name,
        type: 'Medical Report',
        status: 'uploading',
      };
      setUploads((prev) => [newItem, ...prev]);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: 'application/pdf',
      } as any);

      try {
        await uploadAPI.uploadReport(formData);
        updateStatus(newItem.id, 'success');
      } catch (err) {
        updateStatus(newItem.id, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadPrescription = async () => {
    if (!(await checkAuth())) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Please allow access to your photos to upload prescriptions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (result.canceled) return;
    const file = result.assets[0];
    const fileName = file.uri.split('/').pop() || 'prescription.jpg';

    const newItem: UploadItem = {
      id: Date.now().toString(),
      name: fileName,
      type: 'Prescription Image',
      status: 'uploading',
    };
    setUploads((prev) => [newItem, ...prev]);

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    try {
      await uploadAPI.uploadPrescription(formData);
      updateStatus(newItem.id, 'success');
    } catch (err) {
      updateStatus(newItem.id, 'error');
    }
  };

  const uploadMedicalImage = async () => {
    if (!(await checkAuth())) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (result.canceled) return;
    const file = result.assets[0];
    const fileName = file.uri.split('/').pop() || 'scan.jpg';

    const newItem: UploadItem = {
      id: Date.now().toString(),
      name: fileName,
      type: 'X-Ray / MRI Scan',
      status: 'uploading',
    };
    setUploads((prev) => [newItem, ...prev]);

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    try {
      await uploadAPI.uploadMedicalImage(formData);
      updateStatus(newItem.id, 'success');
    } catch (err) {
      updateStatus(newItem.id, 'error');
    }
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text className="text-3xl font-bold text-text-primary mb-2">Upload Data</Text>
          <Text className="text-sm text-text-secondary font-medium mb-8">
            Add reports, prescriptions, or scans to enhance your AI insights.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(800).delay(100)} className="space-y-4 mb-10">
          
          <TouchableOpacity 
            onPress={uploadMedicalPDF}
            className="bg-white p-5 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 bg-brand-500/10 rounded-2xl items-center justify-center border border-brand-500/20">
                <FileText size={24} color="#2563EB" />
              </View>
              <View>
                <Text className="text-base font-bold text-text-primary mb-1">Medical Report</Text>
                <Text className="text-xs text-text-secondary font-medium">PDF lab results or records</Text>
              </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
              <UploadCloud size={16} color="#64748B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={uploadPrescription}
            className="bg-white p-5 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 bg-medical-500/10 rounded-2xl items-center justify-center border border-medical-500/20">
                <Camera size={24} color="#10B981" />
              </View>
              <View>
                <Text className="text-base font-bold text-text-primary mb-1">Prescription</Text>
                <Text className="text-xs text-text-secondary font-medium">Scan Rx images</Text>
              </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
              <UploadCloud size={16} color="#64748B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={uploadMedicalImage}
            className="bg-white p-5 rounded-[24px] shadow-sm shadow-slate-200/50 border border-slate-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 bg-accent-500/10 rounded-2xl items-center justify-center border border-accent-500/20">
                <ImageIcon size={24} color="#7C3AED" />
              </View>
              <View>
                <Text className="text-base font-bold text-text-primary mb-1">X-Ray / MRI</Text>
                <Text className="text-xs text-text-secondary font-medium">Upload medical imaging</Text>
              </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
              <UploadCloud size={16} color="#64748B" />
            </View>
          </TouchableOpacity>

        </Animated.View>

        {uploads.length > 0 && (
          <Animated.View entering={FadeInUp.duration(600)}>
            <Text className="text-lg font-bold text-text-primary mb-4">Recent Uploads</Text>
            
            <View className="space-y-3">
              {uploads.map((item) => (
                <Animated.View 
                  key={item.id} 
                  layout={Layout.springify()}
                  className="bg-white/80 p-4 rounded-[20px] shadow-sm shadow-slate-200/40 border border-slate-100 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="p-2 bg-slate-100 rounded-lg">
                      <FileText size={20} color="#64748B" />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-sm font-bold text-text-primary" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mt-0.5">
                        {item.type}
                      </Text>
                    </View>
                  </View>

                  <View className="w-8 h-8 items-center justify-center">
                    {item.status === 'uploading' && <ActivityIndicator size="small" color="#2563EB" />}
                    {item.status === 'success' && <CheckCircle2 size={24} color="#10B981" />}
                    {item.status === 'error' && <XCircle size={24} color="#EF4444" />}
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
