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
import { global } from "./global.js";
import { Hoverable, Pressable } from "react-native-web-hover";

const { width, height } = Dimensions.get("window");

const sound = new Audio.Sound();
const buttonsound = new Audio.Sound();
const nextpage = new Audio.Sound();


var i = 0;
var background = [

  require("./assets/Pexels_Videos_2620.gif"),
  require("./assets/Pexels_Videos_2018959.gif"),
];

export class Home extends Component {
  state = {
    assetsLoaded: false,
    play: false,
    width: width,
    height: height,
  };

  async componentDidMount() {
    await Font.loadAsync({
      satan: require("./assets/Zombified.ttf"),
    });

    i = Math.floor(Math.random() * 2);

    this.setState({ assetsLoaded: true });

    Dimensions.addEventListener("change", (e) => {
      const { width, height } = e.window;
      this.setState({ width: width, height: height });
    });
  }

  async play() {
    if (!this.state.play) {
      global.read = true;
      try {
        await buttonsound.loadAsync(
          require("./assets/Horror-Whoosh-Swoosh-Sound-Effects.mp3")
        );
        await nextpage.loadAsync(require("./assets/next-page-sound.mp3"));
        await sound.loadAsync(require("./assets/Come-Play-with-Me.mp3"));
        await sound.playAsync();
        sound.setIsLoopingAsync(true);
        this.setState({ play: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      global.read = false;
      sound.unloadAsync();
      buttonsound.unloadAsync();
      nextpage.unloadAsync();
      this.setState({ play: false });
    }
  }

  async playbuttonsound() {
    if ((global.read == true)) {
      try {
        await buttonsound.playAsync();
        buttonsound.setIsLoopingAsync(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async gonextpage() {
    if ((global.read == true)) {
      try {
        await nextpage.playAsync();
        nextpage.setIsLoopingAsync(false);
      } catch (error) {
        console.log(error);
      }
    }
    this.props.navigation.navigate("Introduction");
  }

  render() {
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <ImageBackground
          style={{
            backgroundColor: "black",
            width: this.state.width,
            height:
              this.state.height <= 296 && this.state.width > 935
                ? this.state.height + 100
                : this.state.height,
            justifyContent: "center",
          }}
          source={background[i]}
        >
          <StatusBar hidden />
          <TouchableOpacity
            style={{ position: "absolute", top: 20, right: 20 }}
            onPress={() => this.play()}
          >
            {this.state.play ? (
              <AntDesign name="pause" size={30} color="#fff" />
            ) : (
              <AntDesign name="caretright" size={30} color="#fff" />
            )}
          </TouchableOpacity>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: this.state.width / 5,
                fontWeight: "bold",
                fontFamily: "satan",
                textAlign: "center",
              }}
              onPress={this.componentDidCatch}
            >
              Creepypasta
            </Text>
          </View>
          <Hoverable
            style={{
              alignSelf: "center",
              top: this.state.height / 10,

              width: 150,
              alignItems: "center",
              height: 70,
              justifyContent: "center",
            }}
          >
            {({ hovered }) => (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#fff",
                  width: 150,
                  alignItems: "center",
                  height: 70,
                  justifyContent: "center",
                  shadowColor: hovered ? "#fff" : "#000",
                  shadowOffset: {
                    width: 0,
                    height: 12,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 16.0,

                  elevation: 24,
                }}
                {...(hovered ? this.playbuttonsound() : null)}
                onPress={() => this.gonextpage()}
              >
                <Text
                  style={{ color: "#fff", fontSize: 50, fontFamily: "satan" }}
                >
                  Enter
                </Text>
              </TouchableOpacity>
            )}
          </Hoverable>
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

export default Home;
