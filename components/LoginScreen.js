import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import axios from "axios";

import CountdownTimer from './CountdownTimer';

const HomeScreen = ({ navigation }) => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [quote, setQuote] = useState("Hehe, No quote...");
    const [mheart, setMheart] = useState(0)
    const [wheart, setWheart] = useState(0)
    const [userWasif, setUserWasif] = useState(
        {
            name: "Wasif",
            image_path: require('../assets/mano.jpg'),
            sender_id: '1',
            receiver_id: "2",

        },)
    const [userMano, setUserMano] = useState(
        {
            name: "Mano",
            image_path: require('../assets/wasif.jpg'),
            sender_id: "2",
            receiver_id: "1"
        },
    )

    const handleUserPress = (user, userName) => {
        setLoggedInUser(user);
        navigation.navigate('Ullu', { user: user, record: userName});
    };
    
    const handleChart = () => {
        navigation.navigate('Chart');
    };

    const url = "YOUR_API_TO_GET_TASKS"  // replace it with your API URL

    // Fetch Tasks
    const fetchTasks = async () => {
        await axios.get(`${url}/task-list/`)
            .then(response => {
                const wCount = response.data.filter((task) => task.completed === true && task.toder === "Wasif");
                setWheart(wCount.length);
                const mCount = response.data.filter((task) => task.completed === true && task.toder === "Mano");
                setMheart(mCount.length);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Fetch Tasks
    const fetchQuotes = async () => {
        await axios.get(`https://api.quotable.io/random`)
            .then(response => {
                setQuote(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchTasks();
        fetchQuotes();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>"{quote.content}"</Text>
                <Text style={styles.quoteAuthor}>-{quote.author}</Text>
            </View>

            <View style={styles.profiles}>
                <TouchableOpacity onPress={() => handleUserPress('Wasif', userWasif)}>
                    <Image source={require('../assets/wasif.jpg')} style={styles.image} />
                    <Text style={styles.text}>Wasif</Text>
                    <Text>Prouds ({wheart})  {wheart >= 10000 ? '🤍🤍🤍🤍🤍🤍🤍' : wheart >= 1000 ? '🤍🤍🤍🤍🤍🤍' : wheart >= 700 ? '🤍🤍🤍🤍🤍' : wheart >= 500 ? '🤍🤍🤍🤍' : wheart >= 200 ? '🤍🤍🤍' : wheart >= 50 ? '🤍🤍' : '🤍'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleUserPress('Mano', userMano)}>
                    <Image source={require('../assets/mano.jpg')} style={styles.image} />
                    <Text style={styles.text}>Mano</Text>
                    <Text>Prouds ({mheart})  {mheart >= 10000 ? '💙💙💙💙💙💙💙' : mheart >= 1000 ? '💙💙💙💙💙💙' : mheart >= 700 ? '💙💙💙💙💙' : mheart >= 500 ? '💙💙💙💙' : mheart >= 200 ? '💙💙💙' : mheart >= 50 ? '💙💙' : '💙'}</Text>
                </TouchableOpacity>
            </View>

            {/* Timer */}
            <CountdownTimer />
            {/* version */}
            <Text style={{ textAlign: 'right', color: "#555",}}>v1.0.7       </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    profiles: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: "center",
        marginBottom: 100,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#F9F6EE",
        justifyContent: 'space-evenly',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },

    // Quote
    quoteContainer: {
        padding: 20,
        marginHorizontal: 10,
        marginTop: 20,
    },
    quoteText: {
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: 'semibold',
        textAlign: 'center',
    },
    quoteAuthor: {
        fontSize: 16,
        textAlign: 'right',
        color: "#555",
        marginTop: 5,
    }
});

export default HomeScreen;
