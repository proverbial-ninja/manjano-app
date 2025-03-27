import React, { useState } from "react";
import { Link } from 'expo-router';
import {useRouter} from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,Image } from "react-native";
import { authClient } from "../auth-client";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const apiUri = process.env.EXPO_PUBLIC_API_URL;
      const router = useRouter();

  const handleLogin = async () => {
    console.log("Logging in...");
   await authClient.signIn.email({ email, password,fetchOptions:{
    onSuccess(context) {
      console.log("Signed in", context);
      
      router.push("/dash");

    },
    onError(error) {
      console.error("Sign in failed", error);
    },
   } });
    };


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        style={{ width: 250, height: 300, marginBottom: 20 }}
        source={require("@/assets/images/manjano.png")}
      />
      <Link href="/dash">About</Link>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "yellow",
    paddingVertical: 15,
    alignItems: "center",
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default LoginScreen;


