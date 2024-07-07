import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Choose = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const { record } = route.params;

  const handleTaskPress = () => {
    navigation.navigate('Tasks', { user: user, record: record });
  };

  const handleChatPress = () => {
    navigation.navigate('Diary', { user: user, record: record });
  };
  
  const handleAnalysisPress = () => {
    navigation.navigate('Analysis');
  };

  return (
    <View style={styles.container}>
      <List.Item
        title="Tasks"
        description={`Pdhega kon ${user} ji!`}
        left={() => <List.Icon icon="check-circle-outline" color='green' />}
        onPress={handleTaskPress}
        style={styles.button}
      />
      <List.Item
        title="Chat"
        description={`Aye ${user}, ullu wali baatein kre!`}
        left={() => <List.Icon icon="chat-outline" color='yellow' />}
        onPress={handleChatPress}
        style={styles.button}
      />
      <List.Item
        title="Analysis"
        description={`Aye dkhe ${user}, kisme kitna hai dum!`}
        left={() => <List.Icon icon="graph" color='red' />}
        onPress={handleAnalysisPress}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F6EE",
  },
  button: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
    padding: 20,
  },
});

export default Choose;
