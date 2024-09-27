import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import CallLogs from 'react-native-call-log';

const CallLogsPage = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCallLogPermission();
    }
  }, []);

  // Request permission to read call logs
  const requestCallLogPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Permission',
          message: 'This app needs access to your call logs to display recent calls',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Call Log permission granted');
        setHasPermission(true);
        fetchCallLogs();
      } else {
        console.log('Call Log permission denied');
        Alert.alert('Permission Denied', 'You need to grant call log permission to view logs.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Fetch call logs from the device
  const fetchCallLogs = async () => {
    if (!hasPermission) return;
    try {
      const logs = await CallLogs.load(1); // Fetches all call logs
      setCallLogs(logs);
    } catch (error) {
      console.log('Error fetching call logs:', error);
    }
  };

  // Render each call log
  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}>Number: {item.phoneNumber}</Text>
      <Text style={styles.logText}>Type: {item.type}</Text>
      <Text style={styles.logText}>Date: {new Date(parseInt(item.timestamp)).toLocaleString()}</Text>
      <Text style={styles.logText}>Duration: {item.duration} seconds</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Fetch Call Logs" onPress={fetchCallLogs} />
      {callLogs.length > 0 ? (
        <FlatList
          data={callLogs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No call logs available or permission denied</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logText: {
    fontSize: 16,
  },
});

export default CallLogsPage;
