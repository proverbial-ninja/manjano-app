import React from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { authClient } from './auth-client';
import {useRouter} from 'expo-router';

const apiUri = process.env.EXPO_PUBLIC_API_URL;
export default function EntryScreen({ route, navigation }: { route: any; navigation: any }) {
  const { mood, title, content, tags, id } = useGlobalSearchParams();
const router = useRouter();

  const goToEdit = () => {
    router.push({
      pathname: "/edit",
      params: { emood: mood, etitle: title, econtent: content, etags: tags, eid: id }, // Pass parameters
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const router = useRouter();
            console.log('Deleting entry:', apiUri);

            const response = await authClient.$fetch(`${apiUri}/api/entries/${id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
            console.log(response);
            if (response.data) {
              Alert.alert('Success', 'Entry deleted successfully.');
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete the entry.' + id);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>{mood} {title}</Text>
      <Text style={styles.content}>{content}</Text>
   
      <Text style={styles.tags}>Tags: {tags}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={goToEdit} />
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures ScrollView content stretches properly
    padding: 16,
    backgroundColor: '#fff',
  },
  mood: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  tags: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});