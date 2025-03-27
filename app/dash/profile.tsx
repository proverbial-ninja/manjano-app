import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { authClient } from "../auth-client";
import { router } from "expo-router";

const ProfileScreen = () => {
  const [displayName, setDisplayName] = useState("John Doe"); // Default display name
  const [isEditing, setIsEditing] = useState(false);

  const handleEditDisplayName = () => {

    authClient.updateUser({ name:displayName });    
    
    setIsEditing(!isEditing);
  };


  useEffect(() => {
    const getDisplayName = async () => {
      const { data: session } = await authClient.getSession();
      if (session) {
        setDisplayName(session.user.name);
      }
    };

    getDisplayName();
  }, []);
  const handleLogout = () => {
    
        authClient.signOut();
        router.push('/auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.label}>Display Name:</Text>
      <TextInput
        style={[styles.input, isEditing ? styles.editable : styles.readOnly]}
        value={displayName}
        onChangeText={setDisplayName}
        editable={isEditing}
      />

      <TouchableOpacity style={styles.button} onPress={handleEditDisplayName}>
        <Text style={styles.buttonText}>
          {isEditing ? "Save Display Name" : "Edit Display Name"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  editable: {
    backgroundColor: "#fff",
  },
  readOnly: {
    backgroundColor: "#f0f0f0",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4D4D",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;