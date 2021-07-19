import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Animated,
} from "react-native";
import * as Font from "expo-font";
import { global } from "../Supporting/global.js";
import { ScrollView } from "react-native-gesture-handler";
import { Slider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { Secrets_Algorithmia } from "../Secrets/Algorithmia";

const { width, height } = Dimensions.get("window");
const nextpage = new Audio.Sound();
var Algorithmia = require("algorithmia");
var allclient = [
  Secrets_Algorithmia.client_one,
  Secrets_Algorithmia.client_two,
  Secrets_Algorithmia.client_three,
  Secrets_Algorithmia.client_four,
  Secrets_Algorithmia.client_five,
];
var allurl = [
  Secrets_Algorithmia.url_one,
  Secrets_Algorithmia.url_two,
  Secrets_Algorithmia.url_three,
  Secrets_Algorithmia.url_four,
  Secrets_Algorithmia.url_five,
];
const removedChar = [
  " ",
  "!",
  '"',
  "&",
  "'",
  "?",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "{",
  "}",
];

export class Writestory extends Component {
  state = {
    assetsLoaded: false,
    automaticstory: "",
    loadingstory: false,
    interactive: global.suboptionid == 1 ? true : false,
    interactivestory: "",
    model: 1,
    temperature: 0.1,
    isautomatic: global.suboptionid == 2 ? true : false,
    iswords: global.isword,
    char: 0,
    accountnumber: 0,
    width: width,
    height: height,
    control: width < 945 ? false : true,
    info: "",
  };

  async componentDidMount() {
    this.setState({
      char:
        this.state.iswords && this.state.isautomatic
          ? 10
          : this.state.iswords && !this.state.isautomatic
          ? 1
          : !this.state.iswords && this.state.isautomatic
          ? 100
          : 10,
    });
    await Font.loadAsync({
      Morracle: require("../assets/Morracle.ttf"),
      Happy: require("../assets/Happy-Ending.ttf"),
      Bloody: require("../assets/BLOODY.ttf"),
    });
    this.setState({ assetsLoaded: true });
    if (this.state.isautomatic) {
      this.automaticstory();
    }

    Dimensions.addEventListener("change", (e) => {
      const { width, height } = e.window;
      this.setState({ width: width, height: height });
      this.setState({ control: width < 945 ? false : true });
    });

    this.setState({
      info:
        "Start typing here and get ready to be scared, Have fun! \n\n\n\n\n" +
        (!this.state.iswords ? "First type at least 100 charecters" : "") +
        "\n\nPress Enter to generate text.",
    });
  }

  async automaticstory() {
    var client = allclient[this.state.accountnumber];
    var url = allurl[this.state.accountnumber];
    var error = "";
    this.setState({ loadingstory: true });

    var input = {
      model: this.state.model,
      temperature: this.state.temperature,
      length: this.state.char,
      starting: "",
      level: this.state.iswords ? "word level" : "character level",
      type: global.optiontype,
    };
    Algorithmia.client(client)
      .algo(url)
      .pipe(input)
      .then(
        function (response) {
          try {
            error = response.error.message;
          } catch {
            error = "";
          }
          if (error != "Account doesn't have any remaining credits") {
            var text = response.get().split(" ");
            var txt = "";
            for (var i = 0; i < text.length; i++) {
              if (
                text[i].length > 1 ||
                text[i] == "a" ||
                text[i] == "i" ||
                text[i] == "m" ||
                !/^[A-Z]$/i.test(text[i])
              ) {
                txt = txt + " " + text[i];
              }
            }
            this.setState({
              automaticstory: txt.replace(/\s+/g, " ").trim(),
              loadingstory: false,
              accountnumber: 0,
            });
          } else {
            if (this.state.accountnumber < allclient.length - 1)
              this.setState(
                { accountnumber: this.state.accountnumber + 1 },
                () => this.automaticstory()
              );
          }
        }.bind(this)
      );
  }

  async interactivestory() {
    var client = allclient[this.state.accountnumber];
    var url = allurl[this.state.accountnumber];
    var error = "";

    if (
      (this.state.interactivestory.length >= 100 && !this.state.iswords) ||
      this.state.iswords
    ) {
      if (!this.state.iswords) {
        var last100 = this.state.interactivestory.slice(-100);
        var withoutlast100 = this.state.interactivestory.substring(
          0,
          this.state.interactivestory.length - 100
        );
      } else if (this.state.interactivestory.split(" ").length > 20) {
        var last100 = this.state.interactivestory
          .split(" ")
          .slice(-20)
          .join(" ");
        var withoutlast100 = this.state.interactivestory
          .split(" ")
          .slice(0, this.state.interactivestory.split(" ").length - 20)
          .join(" ");
        withoutlast100 = withoutlast100 + " ";
      } else {
        var last100 = this.state.interactivestory;
        var withoutlast100 = "";
      }
      this.setState({
        loadingstory: true,
        interactivestory: this.state.interactivestory + " generating...",
      });

      if (!this.state.iswords) {
        var characters = last100.toLocaleLowerCase().split("");
        var withoutbanchar = "";
        for (var i = 0; i < 100; i++) {
          withoutbanchar =
            withoutbanchar +
            (removedChar.includes(characters[i]) ? characters[i] : " ");
        }
        last100 = withoutbanchar;
      }

      var input = {
        model: this.state.model,
        temperature: this.state.temperature,
        length: this.state.char,
        starting: last100.toLocaleLowerCase(),
        level: this.state.iswords ? "word level" : "character level",
        type: global.optiontype,
      };
      Algorithmia.client(client)
        .algo(url)
        .pipe(input)
        .then(
          function (response) {
            try {
              error = response.error.message;
            } catch {
              error = "";
            }
            if (error != "Account doesn't have any remaining credits") {
              var text = response.get().split(" ");
              var txt = "";

              for (var i = 0; i < text.length; i++) {
                if (i == 0) {
                  txt = txt + text[i];
                } else if (
                  text[i].length > 1 ||
                  text[i] == "a" ||
                  text[i] == "i" ||
                  text[i] == "m" ||
                  !/^[A-Z]$/i.test(text[i])
                ) {
                  txt = txt + " " + text[i];
                }
              }

              this.setState({
                interactivestory:
                  withoutlast100 + "" + txt.replace(/\s+/g, " ").trim(),
                loadingstory: false,
                accountnumber: 0,
              });
              this.secondTextInput.focus();
            } else {
              if (this.state.accountnumber < allclient.length - 1) {
                this.setState(
                  {
                    accountnumber: this.state.accountnumber + 1,
                    interactivestory: withoutlast100 + "" + last100,
                  },
                  () => this.interactivestory()
                );
              }
            }
          }.bind(this)
        );
    } else {
      alert("Please type atleast 100 characters");
    }
  }

  async gonextpage() {
    try {
      if (global.read == true) {
        await nextpage.loadAsync(require("../assets/next-page-sound.mp3"));
      }
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
            width: this.state.width,
            height: this.state.height,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              left: 20,
              top: 10,
              width: 20,
              position: "absolute",
              zIndex: 1,
            }}
            onPress={() => this.gonextpage()}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          {this.state.isautomatic ? (
            <TouchableOpacity
              style={{
                borderWidth: 4,
                width: 160,
                height: 60,
                borderColor: "#fff",
                justifyContent: "center",
                right: 20,
                top: 20,
                position: "absolute",
                zIndex: 1,
              }}
              onPress={() => this.automaticstory()}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Happy",
                  fontSize: 25,
                  textAlign: "center",
                }}
              >
                Generate New
              </Text>
            </TouchableOpacity>
          ) : !this.state.iswords ? (
            <View
              style={{
                width: 160,
                height: 60,

                justifyContent: "center",
                right: 20,
                top: 20,
                position: "absolute",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Happy",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Total Character {"\n" + this.state.interactivestory.length}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              flexDirection: "row",
              justifyContent: "center",
              width: 220,
              height: 200,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: "#fff",
                width: 180,
                height: 200,
                backgroundColor: "#D3D3D3",
                position: "absolute",
                bottom: 0,
                zIndex: 1,
                left: this.state.control ? 0 : -180,
              }}
            >
              <Text>{"Model & decoder settings"}</Text>
              <View style={{ top: 15 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Model size{" "}
                  <Text
                    style={{
                      color:
                        this.state.model == 1
                          ? "green"
                          : this.state.model == 2
                          ? "#cc9900"
                          : this.state.model == 3
                          ? "red"
                          : null,
                    }}
                  >
                    {" "}
                    {this.state.model == 1
                      ? "Small"
                      : this.state.model == 2
                      ? "Medium"
                      : this.state.model == 3
                      ? "Large"
                      : null}
                  </Text>
                </Text>
                <Slider
                  value={this.state.model}
                  onValueChange={(model) => this.setState({ model })}
                  thumbStyle={{ height: 20, width: 20 }}
                  minimumTrackTintColor="#0080ff"
                  thumbTintColor="#0073e6"
                  maximumValue={3}
                  minimumValue={1}
                  step={1}
                  onSlidingComplete={
                    this.state.isautomatic ? () => this.automaticstory() : null
                  }
                />
              </View>
              <View style={{ top: 8 }}>
                <Text style={{ fontWeight: "bold" }}>
                  Temperature{" "}
                  <Text
                    style={{
                      color:
                        this.state.temperature < 1
                          ? "green"
                          : this.state.temperature < 2
                          ? "#cc9900"
                          : "red",
                    }}
                  >
                    {this.state.temperature.toFixed(2)}
                  </Text>
                </Text>
                <Slider
                  value={this.state.temperature}
                  onValueChange={(temperature) =>
                    this.setState({ temperature })
                  }
                  thumbStyle={{ height: 20, width: 20 }}
                  minimumTrackTintColor="#0080ff"
                  thumbTintColor="#0073e6"
                  maximumValue={3}
                  minimumValue={0.1}
                  onSlidingComplete={
                    this.state.isautomatic ? () => this.automaticstory() : null
                  }
                />
              </View>

              <View style={{ top: 8 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {this.state.iswords ? "Words " : "Characters "}
                  <Text
                    style={{
                      color:
                        (this.state.iswords &&
                          this.state.isautomatic &&
                          this.state.char < 166) ||
                        this.state.char == 1 ||
                        (!this.state.iswords &&
                          this.state.isautomatic &&
                          this.state.char < 700) ||
                        (!this.state.iswords &&
                          this.state.char < 30 &&
                          !this.state.isautomatic)
                          ? "green"
                          : (this.state.iswords &&
                              this.state.isautomatic &&
                              this.state.char < 334) ||
                            this.state.char == 2 ||
                            (!this.state.iswords &&
                              this.state.isautomatic &&
                              this.state.char < 1500) ||
                            (!this.state.iswords &&
                              this.state.char < 70 &&
                              !this.state.isautomatic)
                          ? "#cc9900"
                          : "red",
                    }}
                  >
                    {this.state.char}
                  </Text>
                </Text>
                <Slider
                  value={this.state.char}
                  onValueChange={(char) => this.setState({ char })}
                  thumbStyle={{ height: 20, width: 20 }}
                  minimumTrackTintColor="#0080ff"
                  thumbTintColor="#0073e6"
                  maximumValue={
                    this.state.iswords && this.state.isautomatic
                      ? 500
                      : this.state.iswords && !this.state.isautomatic
                      ? 3
                      : !this.state.iswords && this.state.isautomatic
                      ? 2000
                      : 100
                  }
                  minimumValue={
                    this.state.iswords && this.state.isautomatic
                      ? 10
                      : this.state.iswords && !this.state.isautomatic
                      ? 1
                      : !this.state.iswords && this.state.isautomatic
                      ? 100
                      : 10
                  }
                  step={1}
                  onSlidingComplete={
                    this.state.isautomatic ? () => this.automaticstory() : null
                  }
                />
              </View>
            </View>{" "}
            <TouchableOpacity
              onPress={() => this.setState({ control: !this.state.control })}
              disabled={this.state.width < 945 ? false : true}
              style={{
                width: 40,
                height: 60,
                zIndex: 1,
                position: "absolute",
                right: this.state.control ? 0 : 180,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                top: "40%",
                backgroundColor: "#fff",
                opacity: this.state.width < 945 ? 0.5 : 0,
                justifyContent: "center",
              }}
            >
              {this.state.control ? (
                <AntDesign
                  name="left"
                  size={24}
                  color="black"
                  style={{ alignSelf: "center" }}
                />
              ) : (
                <AntDesign
                  name="right"
                  size={24}
                  color="black"
                  style={{ alignSelf: "center" }}
                />
              )}
            </TouchableOpacity>
          </View>
          <ImageBackground
            style={{
              backgroundColor: "black",
              width: 556,
              height: 685,

              alignSelf: "center",
            }}
            source={require("../assets/writingpaper.png")}
          >
            {this.state.interactive ? (
              <View style={{ top: 65, left: 55 }}>
                {" "}
                <TextInput
                  multiline={true}
                  autoCapitalize={"sentences"}
                  placeholder={this.state.info}
                  placeholderTextColor={"black"}
                  underlineColorAndroid="transparent"
                  spellCheck={false}
                  editable={this.state.loadingstory ? false : true}
                  style={{
                    width: 370,
                    height: 583,
                    fontSize: 18,
                    fontFamily: "Bloody",
                    outlineWidth: 0,
                    outline: "none",
                  }}
                  onChangeText={(interactivestory) =>
                    this.setState({ interactivestory: interactivestory })
                  }
                  value={this.state.interactivestory}
                  onSubmitEditing={() => this.interactivestory()}
                  blurOnSubmit
                  ref={(input) => {
                    this.secondTextInput = input;
                  }}
                />
              </View>
            ) : (
              <>
                {this.state.loadingstory ? (
                  <View style={{ top: 685 / 2 }}>
                    <Text
                      style={{
                        fontFamily: "Morracle",
                        fontSize: 30,
                        textAlign: "center",
                      }}
                    >
                      Loading your story...
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      width: 400,
                      height: 600,
                      top: 45,
                      left: 50,
                      borderTopRightRadius: 100,
                    }}
                  >
                    <ScrollView showsHorizontalScrollIndicator={false}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 18,
                          fontFamily: "Bloody",
                          fontStyle: "italic",
                          width: 370,
                        }}
                      >
                        {this.state.automaticstory}
                      </Text>
                    </ScrollView>
                  </View>
                )}
              </>
            )}
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

export default Writestory;
