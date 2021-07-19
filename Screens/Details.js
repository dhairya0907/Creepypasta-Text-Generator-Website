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
import { global } from "../Supporting/global.js";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");
const nextpage = new Audio.Sound();

export class Details extends Component {
  state = {
    assetsLoaded: false,
    width: width,
    height: height,
    blink: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      Morracle: require("../assets/Morracle.ttf"),
      Happy: require("../assets/Happy-Ending.ttf"),
      Bloody: require("../assets/BLOODY.ttf"),
    });
    this.setState({ assetsLoaded: true });
    Dimensions.addEventListener("change", (e) => {
      const { width, height } = e.window;
      this.setState({ width: width, height: height });
    });
  }
  async gonextpage() {
    if (global.read == true) {
      await nextpage.loadAsync(require("../assets/next-page-sound.mp3"));
    }
    try {
      await nextpage.playAsync();
      nextpage.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.navigate("SubOption");
    setTimeout(() => {
      nextpage.unloadAsync();
    }, 1000);
  }
  async goprvepage() {
    if (global.read == true) {
      await nextpage.loadAsync(require("../assets/next-page-sound.mp3"));
    }
    try {
      await nextpage.playAsync();
      nextpage.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.navigate("Options");
    setTimeout(() => {
      nextpage.unloadAsync();
    }, 1000);
  }

  render() {
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <View
          style={{
            backgroundColor: "black",
            width: this.state.width > 858 ? this.state.width : 870,
            height: this.state.height > 790 ? this.state.height : 810,
            justifyContent: "center",
          }}
        >
          <ImageBackground
            style={{
              backgroundColor: "black",
              width: 858,
              height: 790,

              alignSelf: "center",
            }}
            source={require("../assets/detailbackground.png")}
          >
            <View
              style={{
                position: "absolute",
                top: 180,
                left: global.optionid > 2 ? 150 : 110,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 50,
                  fontWeight: "bold",
                  fontFamily: "Morracle",
                  textAlign: "center",
                }}
                onPress={this.componentDidCatch}
              >
                {global.optionid == 1
                  ? "Character Level LSTM"
                  : global.optionid == 2
                  ? "Character Level GRU"
                  : global.optionid == 3
                  ? "Word Level LSTM"
                  : "Word Level GRU"}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 50,
                right: 300,
                borderWidth: 2,
                borderColor: "#fff",
                height: 60,
                width: 100,
                justifyContent: "center",
              }}
              onPress={() => this.gonextpage()}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "Bloody",
                  textAlign: "center",
                }}
              >
                Start Writing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 50,
                right: 430,
                borderWidth: 2,
                borderColor: "#fff",
                height: 60,
                width: 100,
                justifyContent: "center",
              }}
              onPress={() => this.goprvepage()}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                  fontFamily: "Bloody",
                  textAlign: "center",
                }}
              >
                Go Back
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
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

export default Details;
