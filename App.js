import React, { useEffect, useState } from "react";
import { View, Button, Alert, Image, Text } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

const App = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null); // State to store image URI

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "710398868233-jh26kvmcsqtm8jgoiflagvfj7om44itc.apps.googleusercontent.com", // Replace with your iOS client ID
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info:", userInfo); // Log to inspect the structure
      setUser(userInfo.data.user); // Corrected structure

      Alert.alert("Success", `Signed in as ${userInfo.data.user.name}`);
    } catch (error) {
      console.log(error);
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
      {user ? (
        <>
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
              style={{ width: 200, height: 200, marginVertical: 10 }}
            />
          )}
          <Button title="Pick Image from Gallery" onPress={pickImage} />
          <Button title="Take a Photo" onPress={takePhoto} />
          <Button title="Sign Out" onPress={signOut} color="red" />
        </>
      ) : (
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
      )}
    </View>
  );
};

export default App;
