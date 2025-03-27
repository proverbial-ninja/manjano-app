import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image, KeyboardAvoidingView } from "react-native";
import { authClient } from "../auth-client";
const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("Signing up...");
    authClient.signUp.email({
      name: name,
      email: email,
      password: password,
      fetchOptions: {
        onSuccess(context) {
          console.log("Signed up", context);
        },
        onError(error) {
         // console.error("Sign up failed", error);
          alert("Sign up failed: "+ error);
        },
      },
    });
  };

  return (
   <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image
          style={{ width: 250, height: 300, marginBottom: 20 }}
          source={require("@/assets/images/manjano.png")}
        />
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
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

export default RegisterScreen;

