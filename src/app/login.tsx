import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authenticateWithBiometrics } from "../utils/biometrics";

// Demo credentials
const DEMO_EMAIL = "admin@gmail.com";
const DEMO_PASSWORD = "123456";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Login using email and password
  async function handleLogin() {
    if (loading) return;

    if (
      email.trim().toLowerCase() !== DEMO_EMAIL ||
      password !== DEMO_PASSWORD
    ) {
      Alert.alert("Login Failed", "Invalid email or password.");
      return;
    }

    Alert.alert(
      "Login Successful",
      "Would you like to enable fingerprint login?",
      [
        {
          text: "Not Now",
          onPress: () => router.replace("/home"),
        },
        {
          text: "Enable",
          onPress: async () => {
            setLoading(true);

            try {
              const result = await authenticateWithBiometrics();

              if (result.success) {
                await SecureStore.setItemAsync("biometricEnabled", "true");

                Alert.alert(
                  "Biometrics Enabled",
                  "You can now use fingerprint login.",
                  [
                    {
                      text: "Continue",
                      onPress: () => router.replace("/home"),
                    },
                  ],
                );
              } else {
                Alert.alert("Biometrics", result.message);
                router.replace("/home");
              }
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Error",
                "Unable to enable biometric authentication.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  }

  // Login using fingerprint
  async function handleBiometricLogin() {
    if (loading) return;

    setLoading(true);

    try {
      const enabled = await SecureStore.getItemAsync("biometricEnabled");

      if (enabled !== "true") {
        Alert.alert(
          "Not Enabled",
          "Please log in using your demo account first.",
        );
        return;
      }

      const result = await authenticateWithBiometrics();

      if (result.success) {
        router.replace("/home");
      } else {
        Alert.alert("Biometric Login Failed", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to complete biometric authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.biometricButton}
        onPress={handleBiometricLogin}
        disabled={loading}
      >
        <Text style={styles.biometricText}>Login with Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 35,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: "#000",
  },
  button: {
    backgroundColor: "#208AEF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  biometricButton: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
  },
  biometricText: {
    color: "#208AEF",
    fontWeight: "600",
  },
});