import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import TableExample from './components/DataTable';
import AddTaskScreen from './components/AddTaskScreen';
import LoginScreen from './components/LoginScreen';
import Choose from './components/Choose';
import Chat from './components/Chat';
import AnalyticsPage from './components/AnalyticsPage';

const Stack = createStackNavigator();

export default function App() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#AFE1AF" />
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#AFE1AF",
              },
              headerLeft: ({ onPress }) => (
                <Ionicons style={styles.nav_icon} name="chevron-back" size={20} color="#555" onPress={onPress} />
              ),
              headerRight: () => (
                <View style={styles.hearts}>
                  <FontAwesome style={styles.heartw} name="heartbeat" size={24} color="#00bfff" />
                  <FontAwesome style={styles.heartm} name="heartbeat" size={24} color="#fff" />
                </View>
              ),
            }}>
            <Stack.Screen name='Diaryship' component={LoginScreen} />
            <Stack.Screen name='Ullu' component={Choose} />
            <Stack.Screen name='Diary' component={Chat} />
            <Stack.Screen name="Tasks" component={TableExample} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} />
            <Stack.Screen name="Analysis" component={AnalyticsPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nav_icon: {
    paddingHorizontal: 10,
  },
  heartw: {
    paddingRight: 7,
  },
  heartm: {
    paddingRight: 20,
  },
  hearts: {
    flexDirection: "row",
  }
});
