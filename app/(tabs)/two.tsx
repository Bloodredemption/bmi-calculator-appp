import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabTwoScreen() {

  const data = [];

  return (
    <LinearGradient colors={['#55B8D7', '#fff']} style={styles.container}>
      <Text style={styles.title}>HISTORY</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>BMI</Text>
        </View>

        {data.length > 0 ? (
          data.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{entry.date}</Text>
              <Text style={styles.tableCell}>{`${entry.bmi} - ${entry.status}`}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={() => {}}>
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
