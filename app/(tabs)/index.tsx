import React, { useState } from 'react';
import { Button, TouchableOpacity, StyleSheet, TextInput, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '@/components/Themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { getBackgroundColors } from '@/constants/globals';
import { useTheme } from '@/context/ThemeContext';

export default function TabOneScreen() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null); // Track selected gender
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [name, setName] = useState('');

  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [heightInches, setHeightInches] = useState('');
  const { isSwitchOn, setIsSwitchOn } = useTheme();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleHeightUnitChange = (itemValue: string) => {
    setHeightUnit(itemValue);
    if (itemValue === 'cm') {
      // Reset height and inches when switching to cm
      setHeight('');
      setHeightInches('');
    }
  };

  const resetFields = () => {
    setName('');
    setSelectedGender(null); // Reset selected gender
    setAge('');
    setHeight('');
    setHeightInches('');
    setHeightUnit('cm');  // Reset to default unit if desired
    setWeight('');
    setWeightUnit('kg');  // Reset to default unit if desired
  };

  const calculateBMI = () => {
    let heightInMeters;
    if (heightUnit === 'cm') {
      heightInMeters = parseFloat(height) / 100;
    } else {
      heightInMeters = (parseFloat(height) * 0.3048) + (parseFloat(heightInches) * 0.0254);
    }

    let weightInKg;
    if (weightUnit === 'kg') {
      weightInKg = parseFloat(weight);
    } else {
      weightInKg = parseFloat(weight) * 0.453592;
    }

    let bmi = weightInKg / (heightInMeters * heightInMeters);
    return { bmi: bmi.toFixed(1), gender: selectedGender };
  };

  const validateInputs = () => {
    if (!name) {
      alert('Please enter your name.');
      return false;
    }
    if (!selectedGender) {
      alert('Please select a gender.');
      return false;
    }
    if (!age || !weight || !height || (heightUnit === 'ft' && !heightInches)) {
      alert('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const saveBMIToLocalStorage = async (bmi: string, date: string) => {
    try {
      const existingData = await AsyncStorage.getItem('bmiData');
      const newData = existingData ? JSON.parse(existingData) : [];
      newData.push({ name, bmi, date });
      await AsyncStorage.setItem('bmiData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving BMI data', error);
    }
  };

  const handleCalculatePress = async () => {
    if (validateInputs()) {
      const { bmi, gender } = calculateBMI();
      const date = new Date().toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy
      await saveBMIToLocalStorage(bmi, date);
      const heightValue = heightUnit === 'cm' ? `${height}cm` : `${height}ft ${heightInches}in`;
      router.push({ pathname: '/results', params: { bmi, gender, height: heightValue } });
    }
  };

  const handleThemeChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const backgroundColors = getBackgroundColors(isSwitchOn);
  const textColor = isSwitchOn ? '#fff' : '#333';
  const maleIconColor = selectedGender === 'male' ? (isSwitchOn ? '#0BA9AB' : '#0BA9AB') : (isSwitchOn ? '#aaa' : '#888');
  const femaleIconColor = selectedGender === 'female' ? (isSwitchOn ? '#E652CA' : '#E652CA') : (isSwitchOn ? '#aaa' : '#888');

  return (
    <LinearGradient
      colors={backgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1 }}
      locations={[0, 1]} // Adjusts the color transition points
      style={styles.gradient}
    >
      <View style={styles.switchContainer}>
        <Ionicons name="sunny" size={24} color="#FFA500" />
        <Switch
          value={isSwitchOn}
          onValueChange={handleThemeChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isSwitchOn ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={styles.switch}
        />
        <Ionicons name="moon" size={24} color="#000" />
      </View>
      <Text style={[styles.title, { color: textColor }]}>BMI CALCULATOR</Text>

      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('male')}
        >
          <Ionicons 
            name={selectedGender === 'male' ? 'male' : 'male-outline'}
            size={40}
            color={maleIconColor}
          />
          <Text style={[styles.genderText, { color: textColor }]}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => setSelectedGender('female')}
        >
          <Ionicons 
            name={selectedGender === 'female' ? 'female' : 'female-outline'}
            size={40}
            color={femaleIconColor}
          />
          <Text style={[styles.genderText, { color: textColor }]}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Card with input fields */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>
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
              <Picker.Item label="cm" value="cm" />
              <Picker.Item label="ft" value="ft" />
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
            placeholder="Weight in kg/lb"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={weightUnit}
              style={styles.unitPicker}
              onValueChange={(itemValue) => setWeightUnit(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="lb" value="lb" />
              </Picker>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculatePress}>
          <Text style={styles.buttonText}>CALCULATE</Text>
        </TouchableOpacity>
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
  switchContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'transparent',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
