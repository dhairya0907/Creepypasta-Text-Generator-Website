import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "./Screens/Home";
import Introduction from "./Screens/Introduction.js";
import Options from "./Screens/Options.js";
import Details from "./Screens/Details.js";
import SubOption from "./Screens/SubOption.js";
import Writestory from "./Screens/Writestory.js";

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
