import React, { useRef } from 'react'
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { FAB, IconButton, Searchbar, useTheme } from 'react-native-paper';

import { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';

import axios from "axios";


export default function TableExample({ route }) {

    const url = "YOUR_API_TO_GET_TASKS"  // replace it with your API URL
    const navigation = useNavigation();
    const handleAddTask = () => {
        navigation.navigate('AddTask');
    };

    const { user } = route.params;
    const { colors } = useTheme();
    const animation = useRef(null)

    const [todoList, setTodoList] = useState(null);
    const [state, setState] = useState({ open: false });
    const [completedTasks, setCompletedTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [filt, setFilt] = useState(todoList)
    const [searchQuery, setSearchQuery] = React.useState('');

    const onStateChange = ({ open }) => setState({ open });
    const onChangeSearch = query => setSearchQuery(query);

    const { open } = state;

    useEffect(() => {
        fetchTasks()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
        }, [])
    );

    if (filt != null) {
        // Filter tasks based on search query
        var filteredTasks = filt.filter(task =>
            task.toder.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.date.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }


    const handleFilter = (filterType) => {
        filterType === 'all' ? setFilt(todoList) : filterType === 'completed' ? setFilt(completedTasks) : setFilt(incompleteTasks);
    };

    // Fetch Tasks
    const fetchTasks = async () => {
        await axios.get(`${url}/task-list/`)
            .then(response => {
                setTodoList(response.data);
                setFilt(response.data)
                const filteredCompletedTasks = response.data.filter((task) => task.completed === true);
                setCompletedTasks(filteredCompletedTasks);
                const filteredIncompleteTasks = response.data.filter((task) => task.completed === false);
                setIncompleteTasks(filteredIncompleteTasks);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Delete Selected Task
    const onDeleteTask = async (taskId) => {
        try {
            Alert.alert(
                'Delete',
                `Sachi se delete krna hai kya ${user} ji?`,
                [
                    {
                        text: 'Nhi re',
                        style: 'cancel'
                    },
                    {
                        text: 'Ha ullu',
                        onPress: async () => {
                            await axios.delete(`${url}/task-delete/${taskId}`);
                            fetchTasks();
                            Toast.show({
                                type: 'error',
                                text1: 'Adey!',
                                text2: `Task kyu delete kiya ${user} ji! 😕😥`,
                                visibilityTime: 2000,
                                autoHide: true,
                                topOffset: 30,
                                bottomOffset: 40,
                            });
                        }
                    }
                ],
                { cancelable: false }
            );

        } catch (error) {
            console.error(error);
        }
    };

    // Set Completed to True
    const onCompletedTask = async (task) => {
        if (!task.completed) {
            try {
                await axios.post(`${url}/task-update/${task.id}`);
                fetchTasks();
                Toast.show({
                    type: 'success',
                    text1: 'Shabaash!',
                    text2: `Proud of you, ${user} ji! 💙🤍`,
                    visibilityTime: 3000, // show for 3 seconds
                    autoHide: true,
                    topOffset: 30,
                    bottomOffset: 40,
                });
            } catch (error) {
                console.error(error);
            }
        }
    };


    if (!todoList) return (
        <View style={styles.notload}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 150,
                    height: 150,
                    alignSelf: "center",
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('../assets/heartfly.json')}
            />
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.todoContainer, styles.elevation]}>
            <View style={styles.todoContent}>
                <Text style={styles.todoToder}>{item.toder}</Text>
                <Text style={styles.todoTitle}>{item.title}</Text>
                <Text style={styles.todoDescription}>{item.description}</Text>
                <Text style={styles.todoDate}>{item.date}</Text>
            </View>
            <View style={styles.todoActions}>
                {item.toder == user ? (
                    <>
                        <IconButton
                            icon={item.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                            iconColor={item.completed ? 'green' : 'yellow'}
                            onPress={() => onCompletedTask(item)}
                        />
                        <IconButton
                            icon="delete"
                            iconColor="#C04000"
                            onPress={() => onDeleteTask(item.id)}
                        />
                    </>
                ) : (
                    <>
                        <IconButton
                            icon={item.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                            iconColor="#555"
                        />
                        <IconButton
                            icon="delete"
                            iconColor="#555"
                        />
                    </>
                )}
            </View>
        </View>
    );

    // console.log(filteredTasks.length);
    return (

        <View style={styles.dabba}>

            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.input}
                iconColor={colors.text}
                placeholderTextColor={colors.placeholder}
                clearIcon={{ color: colors.text }}
                theme={{
                    colors: {
                        primary: colors.primary,
                        text: colors.text,
                        placeholder: colors.placeholder,
                        underlineColor: 'transparent',
                    },
                    fonts: {
                        medium: {
                            fontFamily: 'OpenSans-SemiBold',
                        },
                    },
                }}
            />

            {filteredTasks && <Text style={styles.results}>{filteredTasks.length} results</Text>}
            {/* Tasks */}
            <FlatList
                data={filteredTasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />

            {/* Render tasks based on filter */}
            <FAB.Group
                open={open}
                visible
                icon="filter"
                actions={[
                    { icon: 'check-circle', label: 'Completed', onPress: () => handleFilter('completed') },
                    { icon: 'cancel', label: 'Incompleted', onPress: () => handleFilter('incompleted') },
                    { icon: 'check', label: 'All', onPress: () => handleFilter('all') },
                ]}
                onStateChange={onStateChange}
            />

            {/* Add Task Icon */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleAddTask}
                color="black"
            />

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    todoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    todoContent: {
        flex: 1,
    },
    todoTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    todoDescription: {
        fontSize: 16,
        marginBottom: 8,
    },
    todoDate: {
        fontSize: 14,
        color: '#aaa',
    },
    todoActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nav: {
        backgroundColor: '#AFE1AF',
    },
    dabba: {
        flex: 1,
        backgroundColor: "#F9F6EE",
    },
    container: {
        padding: 15,
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
    },
    fab: {
        backgroundColor: '#AFE1AF',
        position: 'absolute',
        margin: 16,
        right: 70,
        bottom: 0,
    },

    // Box shadow
    elevation: {
        elevation: 5,
        shadowColor: '#AFE1AF',
    },

    notload: {
        flex: 1,
        backgroundColor: "#F9F6EF",
        justifyContent: "center",
    },

    // Search Bar
    searchBar: {
        height: 55,
        elevation: 0,
        backgroundColor: "#F9F6EE",
    },
    input: {
        fontSize: 16,
        lineHeight: 24,
    },

    results: {
        color: '#777',
        position: 'absolute',
        margin: 16,
        right: 10,
        top: 0,
    },
});