import { useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native'
import {useRouter} from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../constants/colors';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";


export default function Create() {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState(3);
    const [rating, setRating] = useState("");
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const pickImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (status !== "granted") {
                    Alert.alert("You need to grant us access to your library to upload an image");
                    return;
                }
            }

            // launch image library
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5, // quality is low to accomodate smaller base64
                base64: true,
            })

            if (!result.canceled) {
                setImage(result.assets[0].uri);

                // if base64 exists
                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64);
                } else {
                    // convert to base64 otherwise
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.log("Error in uploading image", error.message);
            Alert.alert("Error uploading image");
        }

    }
    const handleSubmit = async () => {
        
    }
    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }
  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
        {/* title */}
            <View style={styles.header}>
                <Text style={styles.title}>Recommend a Dson course</Text>
                <Text style={styles.subtitle}>Tell others about the classes you love!</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Course Name</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons 
                            name="book-outline"
                            size={20}
                            color={COLORS.textSecondary}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter a course name"
                            placeholderTextColor={COLORS.placeholderText}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Your rating</Text>
                    {renderRatingPicker()}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Course Image</Text>
                    <TouchableOpacity
                        style={styles.imagePicker} 
                        onPress={pickImage}
                    >
                        {image ? (
                            <Image source={{uri: image}} style={styles.previewImage}/>
                        ) : (
                            <View style={styles.placeholderContainer}>
                            <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                            <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder='Write a review about this class'
                        placeholderTextColor={COLORS.placeholderText}
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white}/>
                    ) : (
                        <>
                            <Ionicons
                                name='cloud-upload-outline'
                                size={20}
                                color={COLORS.white}
                                style={styles.buttonIcon}
                            />
                        <Text style={styles.buttonText}>Recommend</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

        </View>

    </ScrollView>
  )
}