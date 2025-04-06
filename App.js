import React, { useEffect, useState } from "react";
import { View, Button, Alert, Image, Text, ScrollView } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { NativeModules } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const { TextRecognitionModule } = NativeModules;

const App = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null); // State to store image URI

  const [response, setResposne] = useState();
  const [resultText, setResultText] = useState("");


  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '710398868233-jh26kvmcsqtm8jgoiflagvfj7om44itc.apps.googleusercontent.com',
    });
  }, []);

  const onPress = async () => {
    if (image) {
      const response = await TextRecognitionModule.recognizeImage(image);
      const extractText = (resp) => {
        if (!resp || !resp.blocks) return "";
        return resp.blocks
          .map((block) => block?.text)
          .filter(Boolean)
          .join("\n");
      };

      const text = extractText(response);
      setResultText(text); 
    } else {
      Alert.alert("Error", "Please select an image first");
    }
  };


  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo.data.user); // Corrected structure

      Alert.alert("Success", `Signed in as ${userInfo.data.user.name}`);
    } catch (error) {
      Alert.alert("Error", "Google Sign-In failed");
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = () => {
    launchCamera({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={['top']}>
        {user ? (
          <ScrollView
            contentContainerStyle={{ padding: 20, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
          >
            {user.photo && (
              <Image
                source={{ uri: user.photo }}
                style={{ width: 50, height: 50, borderRadius: 25, margin: 10 }}
              />
            )}
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Hello, {user.name} 👋
            </Text>

            {image && (
              <Image
                source={{ uri: image }}
                resizeMode="contain"
                style={{ width: 200, height: 200, marginVertical: 10 }}
              />
            )}
            <Button title="Pick Image from Gallery" onPress={pickImage} />
            <Button title="Take a Photo" onPress={takePhoto} />
            <Button title="Sign Out" onPress={signOut} color="red" />
            {image && (
              <Button
                title="Recognize Text"
                color="#841584"
                onPress={onPress}
              />
            )}
            {resultText !== "" && (
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, color: "#333" }}>{resultText}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Sign in with Google" onPress={signInWithGoogle} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );

};

export default App;
