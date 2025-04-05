import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import styles from "../../assets/styles/login.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, isLoading, register, token } = useAuthStore();

  const handleSignUp = async () => {
    const result = await register(username, email, password);

    if (!result.success) Alert.alert("Error", result.error);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* app name */}
          <View style={styles.header}>
            <Text style={styles.title}>CourseQuest</Text>
            <Text style={styles.subtitle}>Recommend your favorite courses at Dson!</Text>
          </View>

          <View style={styles.formContainer}>
            {/* username */}
            <View style={styles.inputGroup}>
                      <Text style={styles.label}>Username</Text>
                      <View style={styles.inputContainer}>
                          <Ionicons
                              name="person-outline"
                              size={20}
                              color={COLORS.primary}
                              style={styles.inputIcon}
                          />
                          <TextInput
                              style={styles.input}
                              placeholder='minhle'
                              placeholderTextColor={COLORS.placeholderText}
                              value={username}
                              onChangeText={setUsername}
                              autoCapitalize='none'
                          />
                      </View>
            </View>

            {/* email */}
            <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email</Text>
                      <View style={styles.inputContainer}>
                          <Ionicons
                              name="mail-outline"
                              size={20}
                              color={COLORS.primary}
                              style={styles.inputIcon}
                          />
                          <TextInput
                              style={styles.input}
                              placeholder='lemin@dickinson.edu'
                              placeholderTextColor={COLORS.placeholderText}
                              value={email}
                              onChangeText={setEmail}
                              autoCapitalize='none'
                          />
                      </View>
            </View>

            {/* password */}
            <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='******'
                            placeholderTextColor={COLORS.placeholderText}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign up</Text>
                )}
            </TouchableOpacity>

            {/* footer */}
            <View style={styles.footer}>
                    <Text style={styles.footerText}>Already registered?</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.link}>Sign in</Text>
                        </TouchableOpacity>
            </View>

            </View>
      </View>
    </View>
  )
}