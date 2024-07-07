import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isPartyTime, setIsPartyTime] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.Y === 0 && newTimeLeft.M === 0 && newTimeLeft.D === 0 && newTimeLeft.H === 0 && newTimeLeft.Min === 0 && newTimeLeft.S === 0) {
        setIsPartyTime(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const countDownDate = new Date("2026-11-18T15:37:25").getTime();
    const now = new Date().getTime();
    let distance = countDownDate - now;

    if (distance < 0) {
      return { Y: 0, M: 0, D: 0, H: 0, Min: 0, S: 0 };
    }

    const Y = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
    distance -= Y * (1000 * 60 * 60 * 24 * 365);
    const M = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
    distance -= M * (1000 * 60 * 60 * 24 * 30);
    const D = Math.floor(distance / (1000 * 60 * 60 * 24));
    distance -= D * (1000 * 60 * 60 * 24);
    const H = Math.floor(distance / (1000 * 60 * 60));
    distance -= H * (1000 * 60 * 60);
    const Min = Math.floor(distance / (1000 * 60));
    distance -= Min * (1000 * 60);
    const S = Math.floor(distance / 1000);

    return { Y, M, D, H, Min, S };
  }

  return (
    <View style={styles.container}>
      {isPartyTime ? (
        <Text style={styles.partyText}>🎉 It's biryani party time! 🎉</Text>
      ) : (
        <View style={styles.container}>
          {Object.keys(timeLeft).map((unit, index) => (
            <View key={index} style={styles.unitContainer}>
              <Text style={styles.value}>{timeLeft[unit]}</Text>
              <Text style={styles.label}>{unit}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitContainer: {
    marginHorizontal: 7,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  partyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC107', // Yellow color
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CountdownTimer;
