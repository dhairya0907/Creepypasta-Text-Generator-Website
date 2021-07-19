import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./Home.js";
import Introduction from "./Introduction.js";
import Options from "./Options.js";
import Details from "./Details.js";
import SubOption from "./SubOption.js";
import Writestory from "./Writestory.js";

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Introduction: { screen: Introduction },
    Options: { screen: Options },
    Details: { screen: Details },
    SubOption: { screen: SubOption },
    Writestory: { screen: Writestory },
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  }
);

const App = createAppContainer(AppNavigator);

export default App;
