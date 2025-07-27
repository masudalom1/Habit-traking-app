import {
  client,
  COMPLETION_COLLECTION_ID,
  DATABASE_ID,
  databse,
  HABITS_COLLECTION_ID,
  RealtimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habits } from "@/types/database.type";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Button, Surface } from "react-native-paper";

export default function Index() {
  const [habits, setHabits] = useState<Habits[]>([]);
  const [selectHabitsId, setSelectHabitsId] = useState<string | null>(null);
  const { logout, user } = useAuth();

  useEffect(() => {
    if (user) {
      const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        channel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes("databases.*.collections.*.documents.*.create") ||
            response.events.includes("databases.*.collections.*.documents.*.update") ||
            response.events.includes("databases.*.collections.*.documents.*.delete")
          ) {
            fetchHabits();
          }
        }
      );

      fetchHabits();

      return () => {
        habitsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databse.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as Habits[]);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!habitId) return;
    try {
      await databse.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, habitId);
      setSelectHabitsId(null);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

const handleCompleted = async (id: string) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  if (!user) return;

  try {
    // Fetch today's completions for this habit
    const response = await databse.listDocuments(
      DATABASE_ID,
      COMPLETION_COLLECTION_ID,
      [
        Query.equal("user_id", user.$id),
        Query.equal("habit_id", id),
        Query.greaterThanEqual("completed_at", startOfDay.toISOString()),
      ]
    );

    // If already completed today
    if (response.total > 0) {
      alert("You've already completed this habit today!");
      return;
    }

    // Proceed with marking as completed
    await databse.createDocument(
      DATABASE_ID,
      COMPLETION_COLLECTION_ID,
      ID.unique(),
      {
        habit_id: id,
        user_id: user.$id,
        completed_at: currentDate.toISOString(),
      }
    );

    const habit = habits.find((h) => h.$id === id);
    if (!habit) return;

    await databse.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, id, {
      streak_count: habit.streak_count + 1,
      last_completed: currentDate.toISOString(),
    });

    router.push("/(tabs)/streaks");
  } catch (error) {
    console.error("Error completing habit:", error);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Habits</Text>
        <Button onPress={logout} icon={"logout"} textColor="#6C47FF">
          Sign Out
        </Button>
      </View>

      {/* ✅ Top 3 Streak Section */}
      <View style={styles.topStreakContainer}>
        <Text style={styles.topStreakTitle}>🏅 Top Streaks</Text>
        {habits
          .sort((a, b) => b.streak_count - a.streak_count)
          .slice(0, 3)
          .map((habit, index) => (
            <View key={habit.$id} style={styles.topCard}>
              <Text style={styles.rankBadge}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.habitTitle}>{habit.title}</Text>
                <Text style={styles.habitDesc}>{habit.description}</Text>
              </View>
              <Text style={styles.streakNumber}>{habit.streak_count}</Text>
            </View>
          ))}
      </View>

      <TouchableWithoutFeedback onPress={() => setSelectHabitsId(null)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {habits.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ color: "#666" }}>
                There is no habit added. Create a habit.
              </Text>
            </View>
          ) : (
            habits.map((habit, key) => (
              <Pressable
                key={key}
                onLongPress={() => setSelectHabitsId(habit.$id)}
              >
                <Surface style={styles.card} elevation={2}>
                  <View style={styles.cardTopRight}>
                    <Pressable
                      onPress={() => handleCompleted(habit.$id)}
                      style={styles.completedButton}
                    >
                      <Text style={styles.completedButtonText}>Completed</Text>
                    </Pressable>
                  </View>

                  <View style={selectHabitsId === habit.$id ? styles.blur : undefined}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitDesc}>{habit.description}</Text>
                    <View style={styles.footer}>
                      <View style={styles.streakBox}>
                        <Text style={styles.streakText}>
                          🔥 {habit.streak_count} day streak
                        </Text>
                      </View>
                      <View style={styles.frequencyChip}>
                        <Text style={styles.frequencyText}>{habit.frequency}</Text>
                      </View>
                    </View>
                  </View>

                  {selectHabitsId === habit.$id && (
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                      <Button
                        onPress={() => handleDelete(habit.$id)}
                        icon="delete"
                        textColor="red"
                      >
                        Delete
                      </Button>
                      <Button
                        onPress={() => setSelectHabitsId(null)}
                        icon="close"
                        textColor="#6C47FF"
                      >
                        Cancel
                      </Button>
                    </View>
                  )}
                </Surface>
              </Pressable>
            ))
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8F8FF",
    flex: 1,
    marginTop:30
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  topStreakContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  topStreakTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  topCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankBadge: {
    width: 30,
    height: 30,
    backgroundColor: "#E8E8FD",
    borderRadius: 15,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#6C47FF",
    fontWeight: "700",
    marginRight: 12,
  },
  streakNumber: {
    fontWeight: "700",
    color: "#6C47FF",
  },
  card: {
    backgroundColor: "#F6EDFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D0C57",
    marginBottom: 4,
  },
  habitDesc: {
    color: "#6A5D7B",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBox: {
    backgroundColor: "#FFF1D6",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    color: "#F4A300",
    fontWeight: "600",
  },
  frequencyChip: {
    backgroundColor: "#E6DAFA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#6C47FF",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyBox: {
    marginTop: 20,
    alignItems: "center",
  },
  blur: {
    opacity: 0.4,
  },
  cardTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  completedButton: {
    backgroundColor: "#6C47FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    elevation: 2,
  },
  completedButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },
});
