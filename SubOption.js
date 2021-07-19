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
import { global } from "./global.js";
import { Hoverable, Pressable } from "react-native-web-hover";
import { Audio } from "expo-av";

const { width, height } = Dimensions.get("window");
const sound = new Audio.Sound();
const nextpage = new Audio.Sound();

export class SubOption extends Component {
  state = {
    assetsLoaded: false,
    activity: false,
    point1: false,
    point2: false,
    point3: false,
    width: width,
    height: height,
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
    }
  }

  optionselected(option) {
    this.setState({ activity: true });
    global.suboptionid = option;

    const interval1 = setInterval(() => {
      this.setState({ point1: true });
      const interval2 = setInterval(() => {
        clearInterval(interval1);
        this.setState({ point2: true });
        const interval3 = setInterval(() => {
          clearInterval(interval2);
          this.setState({ point3: true });
          clearInterval(interval3);
          clearInterval(interval3);
          clearInterval(interval3);
          setTimeout(() => {
            this.gonextpage();
          }, 2000);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  async playbuttonsound() {
    try {
      await sound.playAsync();
      sound.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
  }
  async gonextpage() {
    sound.unloadAsync();

    try {
      if (global.read == true) {
        await nextpage.loadAsync(require("./assets/next-page-sound.mp3"));
      }
      await nextpage.playAsync();
      nextpage.setIsLoopingAsync(false);
    } catch (error) {
      console.log(error);
    }
    this.props.navigation.navigate("Writestory");
    setTimeout(() => {
      nextpage.unloadAsync();
    }, 1000);
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
            alignSelf: "center",
          }}
          source={require("./assets/suboptionbackground.jpeg")}
        >
          <View
            style={{
              alignSelf: "center",
              width:this.state.width <945 ?this.state.width / 1.3 :  this.state.width / 1.8,
              height: 300,
              backgroundColor: "#fff",

              borderRadius: 50,
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 1,
              shadowRadius: 16.0,
              shadowColor: "#fff",

              elevation: 24,
              alignContent: "center",
            }}
          >
            {!this.state.activity ? (
              <>
                {" "}
                <View style={{ top: 15 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Bloody",
                      fontSize:
                        this.state.width < 945 ? this.state.width / 21 : 40,
                      fontWeight: "bold",
                    }}
                  >
                    Choose One, Choose Wisely!
                  </Text>
                </View>
                <Hoverable
                  style={{
                    top: 65,
                    width: "70%",

                    alignItems: "center",
                    height: 70,
                    justifyContent: "center",
                    borderWidth: 4,
                    borderColor: "black",

                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 30,
                  }}
                >
                  {({ hovered }) => (
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        borderRadius: 30,
                        justifyContent: "center",
                        alignSelf: "center",

                        height: 70,
                        shadowOffset: {
                          width: 0,
                          height: 12,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 16.0,
                        shadowColor: hovered ? "black" : "#fff",

                        elevation: 24,
                      }}
                      {...(hovered ? this.playbuttonsound() : null)}
                      onPress={() => this.optionselected(1)}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Bloody",
                          fontSize:
                            this.state.width < 945 ? this.state.width / 26 : 30,
                        }}
                      >
                        Interactive Story Writing!
                      </Text>
                    </TouchableOpacity>
                  )}
                </Hoverable>
                <Hoverable
                  style={{
                    width: "70%",
                    height: 70,
                    borderWidth: 4,
                    borderColor: "black",
                    top: 90,
                    justifyContent: "center",
                    alignSelf: "center",
                    borderRadius: 30,
                  }}
                >
                  {({ hovered }) => (
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        borderRadius: 30,
                        justifyContent: "center",
                        alignSelf: "center",

                        height: 70,
                        shadowOffset: {
                          width: 0,
                          height: 12,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 16.0,
                        shadowColor: hovered ? "black" : "#fff",

                        elevation: 24,
                      }}
                      {...(hovered ? this.playbuttonsound() : null)}
                      onPress={() => this.optionselected(2)}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "Bloody",
                          fontSize:
                            this.state.width < 945 ? this.state.width / 26 : 30,
                        }}
                      >
                        Automatic Story Writing!
                      </Text>
                    </TouchableOpacity>
                  )}
                </Hoverable>
              </>
            ) : (
              <View style={{ top: "45%" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Bloody",
                    fontSize: 35,
                  }}
                >
                  Now there is no turning back {this.state.point1 ? "." : null}{" "}
                  {this.state.point2 ? "." : null}{" "}
                  {this.state.point3 ? "." : null}
                </Text>
              </View>
            )}
          </View>
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

export default SubOption;
