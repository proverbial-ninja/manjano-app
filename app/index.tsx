import React, { useCallback, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { authClient } from './auth-client';
import {useRouter} from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


const LandingPage = () => {
const router = useRouter();
  useEffect(() => {
    const fetchSession = async () => {
      console.log('LandingPage component is shown');
      const { data: session } = await authClient.getSession();
      if (session) {
        console.log('User is signed in');
        
        router.replace('/dash');
      }else{
        console.log('User is not signed in');
       
        router.replace('/auth');
      }
    };

    fetchSession();
  }, []);




  return (
    <View style={styles.container}>
      <Image
             source={require("@/assets/images/manjano.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Manjano </Text>
      <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 190,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default LandingPage;
