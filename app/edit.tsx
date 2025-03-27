import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { authClient } from './auth-client';
import { useGlobalSearchParams } from 'expo-router';

const CreateJournalEntry = () => {
  const { emood, etitle, econtent, etags, eid } = useGlobalSearchParams();

  const [title, setTitle] = useState(etitle);
  const [content, setContent] = useState(econtent);
  const [tags, setTags] = useState<string[]>(Array.isArray(etags) ? etags : etags ? [etags] : []);
  const [tagInput, setTagInput] = useState('');
  const apiUri = process.env.EXPO_PUBLIC_API_URL;


  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    const uuid = Math.random().toString(36).substring(2, 15);
    const entry = { title, content, tags, id: uuid };

    try {
      const response =  await authClient.$fetch(`${apiUri}/api/entries/${eid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
        console.log(response);    
      if (response.data) {
        Alert.alert('Success', 'Journal entry created successfully!');
        setTitle('');
        setContent('');
        setTags([]);
      } else {
        Alert.alert('Error', 'Failed to create journal entry.');
      }
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Journal Entry</Text>
      <TextInput
        style={[styles.input, styles.fullWidth]}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea, styles.fullWidth]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <View style={[styles.tagsContainer, { flexDirection: 'row', alignItems: 'center' }]}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add a tag"
          value={tagInput}
          onChangeText={setTagInput}
        />
        <Button title="Add Tag" onPress={handleAddTag} />
      </View>
      <View style={styles.tagList}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
              <Text style={styles.removeTag}> x </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  fullWidth: {
    width: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  removeTag: {
    marginLeft: 4,
    color: 'red',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateJournalEntry;
