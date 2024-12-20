import { TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBackgroundColors } from '@/constants/globals';
import { useTheme } from '@/context/ThemeContext';

export default function TabTwoScreen() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('bmiData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const formattedData = parsedData.map(entry => ({
          date: entry.date,
          name: entry.name,
          bmi: entry.bmi,
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching BMI data', error);
    }
  };

  const { isSwitchOn } = useTheme();
  
  const handleDeleteAllData = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('bmiData');
              setData([]);
            } catch (error) {
              console.error('Error deleting BMI data', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const backgroundColors = getBackgroundColors(isSwitchOn);
  const textColor = isSwitchOn ? '#fff' : '#333';

  return (
    <LinearGradient 
      colors={backgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1 }}
      locations={[0, 1]}
      style={styles.container}
    >
      <Text style={[styles.title, { color: textColor }]}>HISTORY</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>Name</Text>
          <Text style={styles.tableHeader}>BMI</Text>
        </View>

        <ScrollView style={styles.tableRowsContainer}>
          {data.length > 0 ? (
            data.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{entry.date}</Text>
                <Text style={styles.tableCell}>{entry.name}</Text>
                <Text style={styles.tableCell}>{`${entry.bmi}`}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleDeleteAllData}>
          <Text style={styles.buttonText}>DELETE ALL DATA</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noDataContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRowsContainer: {
    maxHeight: 300, // Adjust the height as needed
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: '100%', // Adjust width as needed
    marginTop: 30,
    padding: 20,
    backgroundColor: 'transparent',
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
