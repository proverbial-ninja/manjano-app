import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { authClient } from "../auth-client";
import { Link, useFocusEffect } from "expo-router";

const EntryListScreen = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const apiUri = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
  
    const fetchEntries = async () => {
      try {
        const { data }: { data: any[] } = await authClient.$fetch(`${apiUri}/api/entries`);
        setEntries(data);
        setFilteredEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);


  useFocusEffect(
    useCallback(() => {
      const fetchEntries = async () => {
        try {
          const { data }: { data: any[] } = await authClient.$fetch(`${apiUri}/api/entries`);
          setEntries(data);
          setFilteredEntries(data);
        } catch (error) {
          console.error("Error fetching entries:", error);
        }
      };

      fetchEntries();
    }, [])
  );

  // Filter entries based on search query and selected tag
  useEffect(() => {
    let filtered = entries;

    if (searchQuery) {
      filtered = filtered.filter((entry) =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((entry) => entry.tags && entry.tags.includes(selectedTag));
    }

    setFilteredEntries(filtered);
  }, [searchQuery, selectedTag, entries]);

  // Calculate statistics
  const totalEntries = filteredEntries.length;
  const averageEntryLength =
    filteredEntries.length > 0
      ? filteredEntries.reduce((sum, entry) => sum + entry.content.length, 0) / filteredEntries.length
      : 0;

  const moodCounts: Record<string, number> = {};
  filteredEntries.forEach((entry) => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }
  });
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
    moodCounts[a] > moodCounts[b] ? a : b,
    ""
  );

  const uniqueTags = new Set(
    entries.flatMap((entry) => (entry.tags ? entry.tags : []))
  );

  const renderEntry = ({ item }: { item: any }) => (
<Link
                style={styles.entry}
                key={item.id}
                href={{
                  pathname: '/entry',
                  params: {
                    id: item.id ?? '',
                    title: item.title ?? '', // Fix typo from 'tile' to 'title'
                    content: item.content ?? '',
                    tags: (item.tags ?? []).join(', '),
                    mood: item.mood ?? '',
                  },
                }}
              >
      <Text style={styles.entryTitle}>{item.mood} {item.title} </Text>
      <Text style={styles.entryDate}>
         - {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </Link>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journal Entries</Text>

      {/* Search and Filter Section */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search entries..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTag}
          onValueChange={(itemValue) => setSelectedTag(itemValue)}
          style={[styles.picker, { height: 200 }]}
          itemStyle={{ fontSize: 16 }}
        >
          <Picker.Item label="All Tags" value="" />
          {[...uniqueTags].map((tag) => (
            <Picker.Item key={tag} label={tag} value={tag} />
          ))}
        </Picker>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Total Entries: {totalEntries}</Text>
        <Text style={styles.stat}>
          Average Entry Length: {averageEntryLength.toFixed(2)} characters
        </Text>
        <Text style={styles.stat}>Most Common Mood: {mostCommonMood || "N/A"}</Text>
        <Text style={styles.stat}>Unique Tags: {uniqueTags.size}</Text>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  statsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  stat: {
    fontSize: 16,
    marginBottom: 5,
  },
  list: {
    paddingBottom: 20,
  },
  entry: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  entryDate: {
    fontSize: 14,
    width: "100%",
    marginLeft: 10,
    textAlign: "right",
    color: "#666",
  },
});

export default EntryListScreen;