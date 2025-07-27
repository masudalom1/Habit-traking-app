import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const {signUp,signIn}=useAuth();
  const router=useRouter();

  const handleAuth = async () => {
  if (!email || !password) {
    setError("Please fill all the fields!");
    return;
  }

  if (password.length < 6) {
    setError("Password should be at least 6 characters long.");
    return;
  }

  setError(null); 

  if (isSignUp) {
    const error = await signUp(email, password);
    if (error) {
      setError(error);
      return;
    }
  } else {
    const error = await signIn(email, password);
    if (error) {
      setError(error);
      return;
    }
    router.replace("/");
  }
  

};

  const handleToggle = () => {
    setIsSignUp((prev) => !prev);
    setEmail("");
    setPassword("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>
            {isSignUp ? "Create an account" : "Welcome back"}
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />

        {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}


    <TouchableOpacity style={styles.button} onPress={handleAuth}>
  <Text style={styles.buttonText}>
    {isSignUp ? "Sign Up" : "Sign In"}
  </Text>
</TouchableOpacity>



          <TouchableOpacity onPress={handleToggle} style={styles.toggle}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  toggle: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#4A90E2",
    fontSize: 14,
  },
});
