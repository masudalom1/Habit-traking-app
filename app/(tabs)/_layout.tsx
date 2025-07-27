import { AntDesign, Feather } from '@expo/vector-icons'; // Added Feather for better graphs
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        // Tab Bar Styling
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        // Header Styling
        headerStyle: {
          backgroundColor: "#f5f5f5",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          tabBarIcon: ({ focused }) => (
            <AntDesign name="calendar" size={24} color={focused ? "black" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-habits"
        options={{
          title: "Add Habits",
          tabBarIcon: ({ focused }) => (
            <AntDesign name="pluscircle" size={24} color={focused ? "black" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        
        options={{
          title: "Streaks",
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <Feather name="bar-chart" size={24} color={focused ? "black" : "gray"} />
          ),
        }}
      />
    </Tabs>
  );
}
