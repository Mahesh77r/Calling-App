import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, TextInput, StyleSheet, Alert } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import InCallScreen from './app/CallWindow';
import InCallManager from 'react-native-incall-manager';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialerOpen, setIsDialerOpen] = useState(false); // To toggle dialer screen
  const [isCallWindowOpen, setIsCallWindowOpen] = useState(false); // To toggle dialer screen

  useEffect(() => {
    // Acquire wake lock during calls or media sessions
    InCallManager.setKeepScreenOn(true);
    
    return () => {
      // Always release the wake lock when done
      InCallManager.setKeepScreenOn(false);
    };
  }, []);

  const endCall = () => {
    InCallManager.stop();
    console.log("Ended")
    setIsCallWindowOpen(false)
  }

  // Function to handle number button press
  const handleNumberPress = (number) => {
    setPhoneNumber((prev) => prev + number);
  };

  // Function to clear the entered number
  const clearPhoneNumber = () => {
    setPhoneNumber('');
  };

  // Function to remove the last entered digit
  const backspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  // Opens the custom dialer with an empty field
  const openCustomDialerEmpty = () => {
    setPhoneNumber(''); // Reset phone number
    setIsDialerOpen(true); // Open the dialer
  };

  // Opens the custom dialer with a pre-filled number
  const openCustomDialerWithNumber = () => {
    setPhoneNumber('+91 9119515866'); // Pre-fill with a number
    setIsDialerOpen(true); // Open the dialer
  };

  // Request permission to make a call
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

  // Function to initiate the call
  const initiateCall = async () => {
    const permissionGranted = await requestCallPermission();
    if (permissionGranted && phoneNumber) {
      SendIntentAndroid.sendPhoneCall(phoneNumber, true);
      // InCallManager.start({media:'audio'})
      setIsCallWindowOpen(true)
    } else if (!phoneNumber) {
      Alert.alert("Enter a phone number", "Please enter a phone number before dialing.");
    } else {
      Alert.alert("Permission Denied", "Phone call permission is required to make calls.");
    }
  };

  // Direct call function
  const directCall = async (num) => {
    const permissionGranted = await requestCallPermission();
    if (permissionGranted && num) {
      InCallManager.start({ media: 'audio' });
      InCallManager.setForceSpeakerphoneOn(true);
      InCallManager.setKeepScreenOn(true);
      SendIntentAndroid.sendPhoneCall(num, false);


      setIsCallWindowOpen(true);
    } else if (!num) {
      Alert.alert("Enter a phone number", "Please enter a phone number before dialing.");
    } else {
      Alert.alert("Permission Denied", "Phone call permission is required to make calls.");
    }
  };

  // Custom Dial Pad UI
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
          {/* Direct Call */}
          <TouchableOpacity style={styles.actionButton} onPress={() => directCall('9119515866')}>
            <Text style={styles.actionButtonText}>Direct Call</Text>
          </TouchableOpacity>
          {/* Button to open dialer with empty field */}
          <TouchableOpacity style={styles.actionButton} onPress={openCustomDialerEmpty}>
            <Text style={styles.actionButtonText}>Open Dialer with Empty Field</Text>
          </TouchableOpacity>

          {/* Button to open dialer with pre-filled number */}
          <TouchableOpacity style={styles.actionButton} onPress={openCustomDialerWithNumber}>
            <Text style={styles.actionButtonText}>Open Dialer with Filled Number</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Display the entered phone number */}
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

          {/* Dial pad */}
          {renderDialPad()}

          {/* Call Button */}
          <TouchableOpacity style={styles.callButton} onPress={initiateCall}>
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>

          {/* Back Button to close dialer */}
          <TouchableOpacity style={styles.backButton} onPress={() => setIsDialerOpen(false)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>


        </>
      )}
      
      {
        isCallWindowOpen ? (
          <>
            <InCallScreen phoneNumber={phoneNumber} endCall={endCall} />
          </>
        ) :
          (<></>)
      }
    </View>
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
