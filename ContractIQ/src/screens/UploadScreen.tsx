import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from 'react-native-paper';
import { analyzeContract } from '../services/api';

const UploadScreen = ({ navigation }: any) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const pickAndUpload = async () => {
    setError('');

    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.length) {
      const file = result.assets[0];

      try {
        setUploading(true);
        const response = await analyzeContract(file);
        navigation.navigate('ResultScreen', { summary: response });
      } catch (err: any) {
        console.error(err);
        setError('Failed to analyze contract.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={pickAndUpload}>
        Upload Contract
      </Button>
      {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
  },
});
