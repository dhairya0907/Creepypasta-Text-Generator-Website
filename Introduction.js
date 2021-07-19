import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Font from "expo-font";
import { Audio } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import TypeWriter from "react-native-typewriter";
import { global } from "./global.js";

const { width, height } = Dimensions.get("window");
const sound = new Audio.Sound();
const nextpage = new Audio.Sound();

export class Introduction extends Component {
  state = {
    assetsLoaded: false,
    play: false,
    enter: false,
    blink: false,
    width: width,
    height: height,
  };

  async componentDidMount() {
    await Font.loadAsync({
      satan: require("./assets/Zombified.ttf"),
    });
    this.setState({ assetsLoaded: true });

    Dimensions.addEventListener("change", (e) => {
      const { width, height } = e.window;
      this.setState({ width: width, height: height });
    });

    if (global.read == true) {
      await nextpage.loadAsync(require("./assets/next-page-sound.mp3"));
    }

    setTimeout(() => {
      this.setState({ enter: true });
      const interval = setInterval(() => {
        this.setState({ blink: !this.state.blink });
      }, 1000);
    }, 17000);

    setTimeout(() => {
      this.readsound();
    }, 1000);
  }

  async readsound() {
    if (global.read == true) {
      await sound.loadAsync(require("./assets/IntroductionSpeach.mp3"));
      await sound.playAsync();
    }
  }

  async gonextpage() {
    try {
      await nextpage.playAsync();
      nextpage.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.navigate("Options");
  }

  render() {
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <ImageBackground
          style={{
            backgroundColor: "black",
            width: this.state.width,
            height: this.state.height > 685 ? this.state.height : 690,
            justifyContent: "center",
          }}
          source={require("./assets/introbackground.png")}
        >
          <StatusBar hidden />

          <ImageBackground
            style={{
              backgroundColor: "black",
              width: 556,
              height: 685,
              alignSelf: "center",
            }}
            source={require("./assets/introtextbackground.gif")}
          >
            <View style={{ top: 80, left: 90, width: 380 }}>
              <TypeWriter
                initialDelay={1000}
                maxDelay={110}
                typing={1}
                style={{ fontSize: 35, color: "black", fontFamily: "satan" }}
              >
                Hello Reader!
              </TypeWriter>
              <TypeWriter
                initialDelay={2450}
                typing={1}
                maxDelay={110}
                style={{ fontSize: 30, color: "black", fontFamily: "satan" }}
              >
                {
                  "\nYou are about to enter inside the scariest place on the internet where you can read the scariest stories and they will keep you awake at night."
                }
              </TypeWriter>
              <TypeWriter
                initialDelay={13500}
                typing={1}
                maxDelay={110}
                style={{ fontSize: 30, color: "black", fontFamily: "satan" }}
              >
                {"\nEnter at your own risk. You have been WARNED."}
              </TypeWriter>
            </View>
            <TouchableOpacity
              style={{
                position: "absolute",
                alignSelf: "center",
                justifyContent: "center",
                bottom: "20%",
                opacity: this.state.enter ? 1 : 0,
              }}
              onPress={() => this.gonextpage()}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: "black",
                  fontFamily: "satan",
                  opacity: this.state.blink ? 1 : 0,
                }}
              >
                Click Here to Enter
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </ImageBackground>
      );
    } else {
      return (
        <View style={{ top: height / 2 }}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({});

export default Introduction;
