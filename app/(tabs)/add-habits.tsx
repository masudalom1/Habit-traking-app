import { DATABASE_ID, HABITS_COLLECTION_ID, databse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

export default function AddHabitScreen() {
  const FREQUENCY = ["Daily", "Weekly", "Monthly"] as const;
  type Frequency = (typeof FREQUENCY)[number];

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("Daily");
  const [error, setError] = useState<string>("");

  const { user } = useAuth();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSubmit = async () => {
    if (!user) return;

    

    try {
      await databse.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency, // ✅ Now frequency is included
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      router.back();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while adding the habit.");
      }
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        label="Title"
        mode="outlined"
        placeholder="Enter habit title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        outlineColor="#ccc"
        activeOutlineColor="#6a1b9a"
        textColor="#000"
        placeholderTextColor="#888"
        theme={{ roundness: 10 }}
      />
      <TextInput
        label="Description"
        mode="outlined"
        placeholder="Enter habit description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        outlineColor="#ccc"
        activeOutlineColor="#6a1b9a"
        textColor="#000"
        placeholderTextColor="#888"
        theme={{ roundness: 10 }}
        multiline
      />
      <View style={styles.segmentWrapper}>
        <SegmentedButtons
          value={frequency}
          onValueChange={(value) => setFrequency(value as Frequency)}
          buttons={FREQUENCY.map((freq) => ({
            value: freq,
            label: freq,
            style: {
              backgroundColor: frequency === freq ? "#6a1b9a" : "#fff",
              borderColor: "#ccc",
              borderRadius: 50,
              borderWidth: 1,
              marginHorizontal: 2,
            },
            labelStyle: {
              color: frequency === freq ? "#fff" : "#000",
              fontWeight: "600",
            },
          }))}
          style={styles.segmented}
        />
      </View>
      <Button
        disabled={!title || !description}
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleSubmit}
      >
        Add Habit
      </Button>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  segmentWrapper: {
    marginBottom: 24,
  },
  segmented: {
    backgroundColor: "#eee",
    borderRadius: 50,
    padding: 4,
  },
  button: {
    backgroundColor: "#6a1b9a",
    borderRadius: 50,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});
