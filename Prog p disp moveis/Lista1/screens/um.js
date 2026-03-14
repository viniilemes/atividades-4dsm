import React from 'react';
import { View, StatusBar } from 'react-native';
import Constants from 'expo-constants';

export default function Um() {
  return (
    <>
      <StatusBar hidden={true} />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingTop: Constants.statusBarHeight,
        }}
      >
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'crimson',
          }}
        />
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'salmon',
          }}
        />
      </View>
    </>
  );
}