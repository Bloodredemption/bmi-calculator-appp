import React, { useState } from 'react';
import { Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '@/components/Themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  const [selectedGender, setSelectedGender] = useState(null); // Track selected gender
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lb');

  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [heightInches, setHeightInches] = useState('');

  const handleHeightUnitChange = (itemValue) => {
    setHeightUnit(itemValue);
    if (itemValue === 'cm') {
      // Reset height and inches when switching to cm
      setHeight('');
      setHeightInches('');
    }
  };

  const resetFields = () => {
    setAge('');
    setHeight('');
    setHeightInches('');
    setHeightUnit('ft');  // Reset to default unit if desired
    setWeight('');
    setWeightUnit('lb');  // Reset to default unit if desired
  };

  return (
    <LinearGradient
      colors={['#55B8D7', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1 }}
      locations={[0, 1]} // Adjusts the color transition points
      style={styles.gradient}
    >
      <Text style={styles.title}>BMI CALCULATOR</Text>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('male')}
        >
          <Ionicons 
            name={selectedGender === 'male' ? 'male' : 'male-outline'}
            size={40}
            color={selectedGender === 'male' ? '#0BA9AB' : '#888'}
          />
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('female')}
        >
          <Ionicons 
            name={selectedGender === 'female' ? 'female' : 'female-outline'}
            size={40}
            color={selectedGender === 'female' ? '#E652CA' : '#888'}
          />
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Card with input fields */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            maxLength={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height</Text>
          
          {heightUnit === 'ft' ? (
            <View style={styles.heightInputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="Feet"
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={heightInches}
                onChangeText={setHeightInches}
                placeholder="Inches"
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="Height in cm"
            />
          )}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={heightUnit}
              style={styles.unitPicker}
              onValueChange={handleHeightUnitChange}
              mode="dropdown"
            >
              <Picker.Item label="ft" value="ft" />
              <Picker.Item label="cm" value="cm" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter your weight"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={weightUnit}
              style={styles.unitPicker}
              onValueChange={(itemValue) => setWeightUnit(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="lb" value="lb" />
              <Picker.Item label="kg" value="kg" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/results" asChild>
          <TouchableOpacity style={styles.calculateButton}>
            <Text style={styles.buttonText}>CALCULATE</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.resetButton} onPress={resetFields}>
          <Text style={styles.buttonText}>RESET</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '42%', // Adjust as needed
    gap: 10,
  },
  gradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%', // Adjust as needed
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  genderOption: {
    alignItems: 'center', // Center the icon and text in the column
  },
  genderText: {
    marginTop: 5, // Add spacing between the icon and text
    fontSize: 16, // Adjust text size as needed
    fontWeight: 'bold',
    color: '#333', // Adjust text color if needed
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    width: 60,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    flex: 1,
    backgroundColor: '#eee',
    padding: 5,
    fontSize: 16,
    borderRadius: 4,
  },
  pickerContainer: {
    borderWidth: 0,
    backgroundColor: '#eee',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center', // Aligns text vertically
    width: 100, // Adjust the width as needed
    marginLeft: 10,
  },
  unitPicker: {
    paddingLeft: 0, // Removes left padding
    marginLeft: 0, // Ensures text is close to the arrow
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '85%', // Adjust width as needed
    marginTop: 20,
    gap: 15,
    backgroundColor: 'transparent',
  },
  calculateButton: {
    backgroundColor: '#0202C5',
    opacity: 0.79, // 79% opacity
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 40,
  },
  resetButton: {
    backgroundColor: '#BC0000',
    opacity: 0.8, // 80% opacity
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 40,
  },
  buttonText: {
    color: '#FFFFFF', // White text color for readability
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
