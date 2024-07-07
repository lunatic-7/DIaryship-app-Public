import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Checkbox, TextInput, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

import rose from '../assets/rose.jpg';

const AddTaskScreen = () => {
    const [toder, setToder] = useState('Mano');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    const url = "YOUR_API_TO_ADD_TASK"  // replace it with your API URL
    const navigation = useNavigation();

    const handleSubmit = async () => {
        try {
            await axios.post(`${url}/task-create/`, {
                toder,
                title,
                description,
                completed: isCompleted,
            });
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.ultracontainer} behavior="padding" enabled>
            <View style={styles.container}>
                <View style={styles.quoteContainer}>
                    <Image source={rose} style={styles.image} resizeMode='contain' />
                    <Text style={styles.quote}>"I want to work on myself with you by my side and I want you to work on yourself with me by your side.
                        Life ain't easy, let's do this together..."</Text>
                </View>
                <Divider />
                <View style={styles.pick}>
                    <Picker
                        selectedValue={toder}
                        onValueChange={(itemValue, itemIndex) => setToder(itemValue)}>
                        <Picker.Item label="Mano" value="Mano" />
                        <Picker.Item label="Wasif" value="Wasif" />
                    </Picker>
                </View>
                <TextInput
                    label="Title"
                    value={title}
                    mode="outlined"
                    outlineColor="#93C572"
                    theme={{ colors: { primary: '#93C572', underlineColor: 'transparent', } }}
                    onChangeText={(text) => setTitle(text)}
                    style={styles.input}
                />
                <TextInput
                    label="Description"
                    value={description}
                    mode="outlined"
                    outlineColor="#93C572"
                    theme={{ colors: { primary: '#93C572', underlineColor: 'transparent', } }}
                    onChangeText={(text) => setDescription(text)}
                    style={styles.input}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={isCompleted ? 'checked' : 'unchecked'}
                        onPress={() => setIsCompleted(!isCompleted)}
                        theme={{ colors: { primary: 'green', underlineColor: 'transparent', } }}
                    />
                    <Button
                        mode="text"
                        onPress={() => setIsCompleted(!isCompleted)}
                        style={styles.checkboxLabel}
                        textColor="black"
                    >
                        Completed
                    </Button>
                </View>
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Add Task
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    pick: {
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#AFE1AF',
        backgroundColor: 'white',
    },
    ultracontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F9F6EE",
    },
    quoteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    quote: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    input: {
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: -10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#93C572",
    },
    image: {
        width: 170,
        height: 170,
        marginBottom: 10,
    },
});

export default AddTaskScreen;