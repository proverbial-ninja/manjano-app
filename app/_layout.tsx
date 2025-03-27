import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { authClient } from './auth-client';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();

  const logout = () => {
    authClient.signOut();
    router.push('/auth');}  

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack   >
     
      <Stack.Screen 
  name="entry" 
  options={{ 
    title: 'Entry Details',
   
  }} 
/>

 
        <Stack.Screen name="edit" options={{title: 'Edit Entry'}}  />
        <Stack.Screen name="create" options={{title: 'Create Entry'}}  />
        <Stack.Screen name="auth" options={{title: 'Login'}}  />
        <Stack.Screen name="dash" options={{title: 'User Dashboard',   headerRight: () => (
            <Link href="/create">
              <Text>Create</Text>
            </Link>
          ),}} />
        <Stack.Screen name="+not-found" />
      

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
