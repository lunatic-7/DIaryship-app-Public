import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import axios from 'axios';
import { SafeAreaView, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import moment from 'moment';


const AnalyticsPage = () => {
    const url = "YOUR_API_TO_GET_TASKS";  // replace it with your API URL
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedDay, setSelectedDay] = useState(0);
    const [wasifData, setWasifData] = useState(null)
    const [manoData, setManoData] = useState(null)
    const [wasifTotal, setWasifTotal] = useState(0)
    const [manoTotal, setManoTotal] = useState(0)

    const animation = useRef(null)

    const screenWidth = Dimensions.get("window").width - 20;
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios.get(`${url}/task-list/`);
        const allData = response.data;

        // Get data for last 3 months only
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const filteredData = allData.filter(
            (item) => new Date(item.date) >= threeMonthsAgo
        );

        // Separate data for each toder
        const wasifData = filteredData.filter((item) => item.toder === "Wasif");
        const manoData = filteredData.filter((item) => item.toder === "Mano");

        // Calculate completed tasks count for each day
        const wasifCount = {};
        const manoCount = {};

        const today = new Date();
        // threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        for (let z = threeMonthsAgo; z <= today; z.setDate(z.getDate() + 1)) {
            manoCount[z.toISOString().slice(0, 10)] = 0;
        }

        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        for (let d = threeMonthsAgo; d <= today; d.setDate(d.getDate() + 1)) {
            wasifCount[d.toISOString().slice(0, 10)] = 0;
        }
        
        // Initialize total count for each toder to zero
        let wasifTotal = 0;
        let manoTotal = 0;
        
        wasifData.forEach((item) => {
            const date = item.date;
            if (wasifCount[date]) {
                wasifCount[date] += item.completed ? 1 : 0;
            } else {
                wasifCount[date] = item.completed ? 1 : 0;
            }
            wasifTotal += item.completed ? 1 : 0;
        });
        
        
        manoData.forEach((item) => {
            const date = item.date;
            if (manoCount[date]) {
                manoCount[date] += item.completed ? 1 : 0;
            } else {
                manoCount[date] = item.completed ? 1 : 0;
            }
            manoTotal += item.completed ? 1 : 0;
        });

        // Store total count for each toder in state
        setWasifTotal(wasifTotal);
        setManoTotal(manoTotal);

        let wa = (Object.entries(wasifCount).map(([date, count]) => ({
            date: date,
            count: count
        })));
        setWasifData(wa);

        let ma = (Object.entries(manoCount).map(([date, count]) => ({
            date: date,
            count: count
        })));
        setManoData(ma)
    };


    if (!wasifData || !manoData) {
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
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('../assets/heartfly.json')}
                />
            </View>
        )
    }

    const chartConfig = {
        // backgroundGradientFrom: "#1E2923",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.7,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    };


    const onDayPress = (value) => {
        const date = new Date(value.date);
        const formattedDate = date.toISOString().split('T')[0];
        const fdate = moment(formattedDate).format('MMM D');
        setSelectedDay(value.count);
        setSelectedDate(fdate);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>

                    <Text style={styles.text}>Wasif's Analysis</Text>
                    <Text style={styles.desc}>{wasifTotal} tasks completed in last 3 months...</Text>

                    <ContributionGraph
                        values={wasifData}
                        endDate={new Date()}
                        numDays={wasifData.length}
                        width={screenWidth}
                        height={240}
                        chartConfig={chartConfig}
                        onDayPress={onDayPress}
                        gutterSize={3}
                    />

                    <Text style={styles.text}>Mano's Analysis</Text>
                    <Text style={styles.desc}>{manoTotal} tasks completed in last 3 months...</Text>
                    <ContributionGraph
                        values={manoData}
                        endDate={new Date()}
                        numDays={manoData.length}
                        width={screenWidth}
                        height={240}
                        chartConfig={chartConfig}
                        onDayPress={onDayPress}
                        gutterSize={3}
                    />

                    <Text style={styles.day}>{selectedDay} - tasks completed on {selectedDate}</Text>
                </View>
        </SafeAreaView>
    );
};

export default AnalyticsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F6EF',
        textAlign: 'center',
        padding: 10,
    },
    notload: {
        flex: 1,
        backgroundColor: "#F9F6EF",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        paddingTop: 20,
    },
    desc: {
        color: "#777",
        paddingBottom: 10,
    },
    day: {
        position: 'absolute',
        margin: 16,
        right: 20,
        bottom: 0,
    }
});