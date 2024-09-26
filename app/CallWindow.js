import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import InCallManager from 'react-native-incall-manager';

const InCallScreen = ({ phoneNumber, endCall }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  useEffect(() => {
    // Start the call timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Manage audio settings (InCallManager)
    InCallManager.start({ media: 'audio' }); // Start audio for the call

    return () => {
      clearInterval(timer); // Clear timer when component is unmounted or call ends
      InCallManager.stop();  // Stop audio and reset InCallManager
    };
  }, []);

  const formatDuration = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    InCallManager.setMicrophoneMute(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    InCallManager.setSpeakerphoneOn(!isSpeakerOn);
  };

  const handleAddCall = () => {
    // Logic to add another call
    Alert.alert('Add Call', 'Functionality to add another call');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.callerInfo}>Calling {phoneNumber}</Text>
      <Text style={styles.timer}>Call Time: {formatDuration()}</Text>

      <View style={styles.controls}>
        {/* Mute Button */}
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Text style={styles.controlButtonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {/* Speaker Button */}
        <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
          <Text style={styles.controlButtonText}>{isSpeakerOn ? 'Speaker Off' : 'Speaker On'}</Text>
        </TouchableOpacity>

        {/* Add Call Button */}
        <TouchableOpacity style={styles.controlButton} onPress={handleAddCall}>
          <Text style={styles.controlButtonText}>Add Call</Text>
        </TouchableOpacity>
      </View>

      {/* End Call Button */}
      <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
        <Text style={styles.endCallButtonText}>End Call</Text>
      </TouchableOpacity>
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
  callerInfo: {
    fontSize: 22,
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 50,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  endCallButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
  },
  endCallButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InCallScreen;
