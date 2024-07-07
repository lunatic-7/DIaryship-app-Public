import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { Bubble } from "react-native-gifted-chat/lib/GiftedChat";
import Ionicons from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import { IconButton } from "react-native-paper";
import LottieView from 'lottie-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "chatMessages";

const Chat = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(route.params.record.sender_id);
    const [receiverId, setReceiverId] = useState(route.params.record.receiver_id);
    const [name, setName] = useState(route.params.record.name);
    const [image_path, setImage_path] = useState(route.params.record.image_path);
    const [isLoading, setIsLoading] = useState(true);
    const ws = useRef(null);
    const animation = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(`YOUR_WEBSOCKET_API`);  // Replace with your websocket api
        ws.current.onopen = () => {
            setIsLoading(false);
            // console.log("Connection establish open");
        };
        ws.current.onclose = () => {
            setIsLoading(true);
            // console.log("Connection closed");
        }

        AsyncStorage.getItem(CHAT_STORAGE_KEY)
            .then((data) => {
                const parsedMessages = data ? JSON.parse(data) : [];

                const parsedMessage = parsedMessages.map(message => ({
                    _id: message._id,
                    text: message.text,
                    createdAt: message.createdAt,
                    user: {
                        _id: message.user._id,
                        name: name,
                        avatar: image_path,
                    },
                }));
                setMessages(parsedMessage);
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        ws.current.onmessage = (e) => {
            const response = JSON.parse(e.data);
            if (response.senderId !== senderId) {
                var sentMessages = {
                    _id: uuid.v4(),
                    text: response.message,
                    createdAt: new Date(),
                    user: {
                        _id: response.senderId,
                        name: name,
                        avatar: image_path,
                    },
                };
                setMessages((previousMessages) =>
                    GiftedChat.append(previousMessages, sentMessages)
                );
            }
        };
    }, []);

    const saveMessagesToStorage = useCallback((messages) => {
        AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }, []);


    const clearMessagesFromStorage = () => {
        Alert.alert(
            "Clear Chat",
            `Yawr chat kyu uda re, ${name} ji?`,
            [
                {
                    text: "Na udae",
                    style: "cancel",
                },
                {
                    text: "Udae miii",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Clear chat messages from AsyncStorage
                            await AsyncStorage.removeItem("chatMessages");

                            // Update messages state to empty array
                            setMessages([]);
                        } catch (error) {
                            console.error("Error clearing chat messages:", error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const onSend = useCallback((messages = []) => {
        let obj = {
            senderId: senderId,
            receiverId: receiverId,
            message: messages[0].text,
            action: "message",
        };
        ws.current.send(JSON.stringify(obj));
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
        );
    }, []);

    const CustomSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 8 }}>
                    <Ionicons name="send" size={26} color="#AFE1AF" />
                </View>
            </Send>
        );
    };

    const customBubbleStyle = {
        right: {
            backgroundColor: "#93C572",
            padding: 3,
        },
        left: {
            backgroundColor: "#E5E4E2",
            padding: 3,
        },
    };

    useEffect(() => {
        saveMessagesToStorage(messages);
    }, [messages, saveMessagesToStorage]);

    if (isLoading) {
        return (
            <View style={styles.notload}>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 150,
                        height: 150,
                        alignSelf: "center",
                    }}
                    source={require("../assets/heartfly.json")}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: senderId,
                }}
                renderSend={CustomSend}
                renderBubble={(props) => (
                    <Bubble {...props} wrapperStyle={customBubbleStyle} />
                )}
                placeholder={`Idhar likhe ${name} ji...`}
                textInputStyle={{
                    lineHeight: 24,
                }}
            />
            <IconButton
                icon={({ size, color }) => (
                    <Ionicons name="trash-bin" size={size} color="#C04000" />
                )}
                onPress={clearMessagesFromStorage}
                style={styles.clearButton}
                color="#FF0000"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F6EE",
    },
    notload: {
        flex: 1,
        backgroundColor: "#F9F6EF",
        justifyContent: "center",
    },
    clearButton: {
        position: "absolute",
        top: 16,
        right: 10,
    },
});

export default Chat;
