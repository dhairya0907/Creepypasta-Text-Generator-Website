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
import { StatusBar } from "expo-status-bar";
import { global } from "./global.js";
import { FlatGrid } from "react-native-super-grid";
import { ScrollView } from "react-native-gesture-handler";
import { Hoverable, Pressable } from "react-native-web-hover";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");
const options = [
  {
    type: "LSTM",
    name: "Character Level Text Generation",
    epoch: 22,
    loss: 1.151,
    accuracy: "0.6405",
    time: "14d 18h 43m 4s",
    files: 10,
    size: "155 mb",
    id: 1,
    isword: false,
  },
  {
    type: "GRU",
    name: "Character Level Text Generation",
    epoch: 5,
    loss: 1.516,
    accuracy: 0.5444,
    time: "1d 10h 5m 36s",
    files: 4,
    size: "50 mb",
    id: 2,
    isword: false,
  },
  {
    type: "LSTM",
    name: "Word Level Text Generation",
    epoch: 5,
    loss: 3.546,
    accuracy: 0.2974,
    time: "8d 16h 19m 18s",
    files: 2,
    size: "55 mb",
    id: 3,
    isword: true,
  },
  {
    type: "GRU",
    name: "Word Level Text Generation",
    epoch: 5,
    loss: 4.667,
    accuracy: 0.2156,
    time: "1d 10h 48m 20s",
    files: 1,
    size: "9.8 mb",
    id: 4,
    isword: true,
  },
];

const sound = new Audio.Sound();
const nextpage = new Audio.Sound();

export class Options extends Component {
  state = {
    assetsLoaded: false,
    width: width,
    height: height,
    blink: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      Morracle: require("./assets/Morracle.ttf"),
      Happy: require("./assets/Happy-Ending.ttf"),
      Bloody: require("./assets/BLOODY.ttf"),
    });
    this.setState({ assetsLoaded: true });
    Dimensions.addEventListener("change", (e) => {
      const { width, height } = e.window;
      this.setState({ width: width, height: height });
    });
    if (global.read) {
      await sound.loadAsync(
        require("./assets/Horror-Whoosh-Swoosh-Sound-Effects.mp3")
      );
      await nextpage.loadAsync(require("./assets/next-page-sound.mp3"));
    }
  }

  async gotodetails(item) {
    try {
      await nextpage.playAsync();
      nextpage.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
    global.optionid = item.id;
    global.isword = item.isword;
    global.optiontype = item.type.toLowerCase();
    this.props.navigation.navigate("SubOption");
  }

  async playsound() {
    try {
      await sound.playAsync();
      sound.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <ImageBackground
          style={{
            backgroundColor: "black",
            width: this.state.width,
            height: this.state.height,
            justifyContent: "center",
          }}
          source={require("./assets/optionsbackground.jpeg")}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ zIndex: 1 }}
          >
            <StatusBar hidden />
            <View style={{ alignSelf: "center", top: 35 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 80,
                  fontWeight: "bold",
                  fontFamily: "Morracle",
                  textAlign: "center",
                }}
              >
                Pick Your Poison
              </Text>
            </View>
            <View>
              <FlatGrid
                itemDimension={500}
                data={options}
                spacing={50}
                style={{ right: 30 }}
                renderItem={({ item }) => (
                  <Hoverable
                    style={{
                      width: "100%",
                      height: 460,
                      alignSelf: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderRadius: 100,
                      top: 70,
                      left: 30,
                    }}
                  >
                    {({ hovered }) => (
                      <TouchableOpacity
                        style={{
                          alignSelf: "center",
                          borderWidth: 3,
                          borderColor: "#fff",
                          width: "100%",
                          height: 460,

                          padding: 20,
                          borderRadius: 100,
                          shadowColor: hovered ? "#fff" : "#000",
                          shadowOffset: {
                            width: 0,
                            height: 12,
                          },
                          shadowOpacity: 1,
                          shadowRadius: 16.0,

                          elevation: 24,
                          justifyContent: "center",
                        }}
                        {...(hovered ? this.playsound() : null)}
                        onPress={() => this.gotodetails(item)}
                      >
                        <View
                          style={{
                            width: "95%",
                            height: "95%",
                            alignSelf: "center",
                            top: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize:
                                this.state.width / 15.5 < 35
                                  ? this.state.width / 15
                                  : 35,
                              fontWeight: "bold",
                              fontFamily: "Happy",
                            }}
                          >
                            {item.name}
                          </Text>
                          <View style={{ top: 20 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Type : {item.type}
                            </Text>
                          </View>
                          <View style={{ top: 30 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Files : {item.files}
                            </Text>
                          </View>
                          <View style={{ top: 40 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Size : {item.size}
                            </Text>
                          </View>
                          <View style={{ top: 50 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Loss : {item.loss}
                            </Text>
                          </View>
                          <View style={{ top: 60 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Accuracy : {item.accuracy}
                            </Text>
                          </View>
                          <View style={{ top: 70 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Total Epochs : {item.epoch}
                            </Text>
                          </View>
                          <View style={{ top: 80 }}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize:
                                  this.state.width / 15.5 < 25
                                    ? this.state.width / 15
                                    : 25,
                                fontWeight: "bold",
                                fontFamily: "Bloody",
                              }}
                            >
                              Total Time : {item.time}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  </Hoverable>
                )}
              />
            </View>
          </ScrollView>
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

export default Options;
