import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModalScreen() {
  return (
    <LinearGradient
      colors={['#55B8D7', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1 }}
      locations={[0, 1]} // Adjusts the color transition points
      style={styles.gradient}
    >
        <View style={styles.bmiResultBox}>
            {/* <Text style={styles.bmiResultText}>Your BMI: 22.5 - Normal</Text> */}
        </View>

        {/* <View style={styles.separator} /> */}

        <Text style={styles.title}>Guide</Text>

        <View style={styles.guideContainer}>
            <Text style={styles.guideText}>Underweight ------ &lt; 18.5</Text>
            <Text style={styles.guideText}>Normal --------- 18.5 - 24.9</Text>
            <Text style={styles.guideText}>Overweight ----- 25 - 29.9</Text>
        </View>
        
        <View style={styles.buttonContainer}>
            <Link href="/" asChild>
                <TouchableOpacity style={styles.resetButton} onPress={() => {}}>
                    <Text style={styles.buttonText}>RE-CALCULATE</Text>
                </TouchableOpacity>
            </Link>
        </View>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideContainer: {
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  guideText: {
    fontSize: 22,
    fontWeight: '500',
    marginVertical: 2,
  },
  bmiResultBox: {
    width: '80%',
    height: 300,
    padding: 16,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: '#fff',
    opacity: 0.8,
    alignItems: 'center',
    marginBottom: 25,
  },
  bmiResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: '100%', // Adjust width as needed
    marginTop: 30,
    padding: 20,
    backgroundColor: 'transparent',
  },
  resetButton: {
    backgroundColor: '#0B780B',
    opacity: 0.8, // 80% opacity
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
