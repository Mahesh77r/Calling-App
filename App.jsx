import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, TextInput, StyleSheet, Alert } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CallLogsPage from './app/CallLogs';
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialerOpen, setIsDialerOpen] = useState(false);

  const handleNumberPress = (number) => {
    setPhoneNumber((prev) => prev + number);
  };

  const clearPhoneNumber = () => {
    setPhoneNumber('');
  };

  const backspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const openCustomDialerEmpty = () => {
    setPhoneNumber('');
    setIsDialerOpen(true);
  };

  const openCustomDialerWithNumber = () => {
    setPhoneNumber('+91 9119515866');
    setIsDialerOpen(true);
  };

  const requestCallPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: 'App Needs Permission',
          message: 'MyApp needs phone call permission to dial directly',
          buttonNegative: 'Disagree',
          buttonPositive: 'Agree',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Error with call permission:", err);
      return false;
    }
  };

  const initiateCall = async () => {
    const permissionGranted = await requestCallPermission();
    if (permissionGranted && phoneNumber) {
      SendIntentAndroid.sendPhoneCall(phoneNumber, true);
    } else if (!phoneNumber) {
      Alert.alert("Enter a phone number", "Please enter a phone number before dialing.");
    } else {
      Alert.alert("Permission Denied", "Phone call permission is required to make calls.");
    }
  };

  const directCall = async (num) => {
    const permissionGranted = await requestCallPermission();
    if (permissionGranted && num) {
      SendIntentAndroid.sendPhoneCall(num, true);
    } else if (!num) {
      Alert.alert("Enter a phone number", "Please enter a phone number before dialing.");
    } else {
      Alert.alert("Permission Denied", "Phone call permission is required to make calls.");
    }
  };

  const renderDialPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['*', '0', '#'],
    ];

    return numbers.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.dialRow}>
        {row.map((num) => (
          <TouchableOpacity key={num} style={styles.dialButton} onPress={() => handleNumberPress(num)}>
            <Text style={styles.dialText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {!isDialerOpen ? (
        <>
          <TouchableOpacity style={styles.actionButton} onPress={() => directCall('9119515866')}>
            <Text style={styles.actionButtonText}>Direct Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={openCustomDialerEmpty}>
            <Text style={styles.actionButtonText}>Open Dialer with Empty Field</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={openCustomDialerWithNumber}>
            <Text style={styles.actionButtonText}>Open Dialer with Filled Number</Text>
          </TouchableOpacity>

          {/* New button to navigate to Call Logs */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CallLogs')}>
            <Text style={styles.actionButtonText}>Go to Call Logs</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              editable={false}
            />
            <TouchableOpacity style={styles.clearButton} onPress={clearPhoneNumber}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backspaceButton} onPress={backspace}>
              <Text style={styles.backspaceText}>⌫</Text>
            </TouchableOpacity>
          </View>

          {renderDialPad()}

          <TouchableOpacity style={styles.callButton} onPress={initiateCall}>
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => setIsDialerOpen(false)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CallLogs" component={CallLogsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '60%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  clearText: {
    fontSize: 18,
    color: '#fff',
  },
  backspaceButton: {
    marginLeft: 10,
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
  },
  backspaceText: {
    fontSize: 18,
    color: '#fff',
  },
  dialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dialButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dialText: {
    fontSize: 24,
    color: '#fff',
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  callButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  callText: {
    fontSize: 18,
    color: '#fff',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;
