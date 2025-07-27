import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoodingUser } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === "auth";

      if (!user && !inAuthGroup && !isLoodingUser) {
        router.replace("/auth");
      } else if (user && inAuthGroup && !isLoodingUser) {
        router.replace("/");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isLoodingUser, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <RouteGuard>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
