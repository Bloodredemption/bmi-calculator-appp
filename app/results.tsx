import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getBackgroundColors } from '@/constants/globals';
import { useTheme } from '@/context/ThemeContext';

const getBmiDescription = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
  if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
  return 'Obese';
};

const getBmiTip = (bmi: number) => {
  if (bmi >= 30) return 'As your BMI increases, your risk of developing coronary heart disease, diabetes and some cancers increases. It is important that you take steps to reduce your weight.';
  if (bmi >= 25 && bmi < 30) return 'Being overweight increases your risk of developing coronary heart disease, as well as other health conditions such as diabetes. Keeping to a healthy weight will help you control your blood pressure and cholesterol levels.';
  if (bmi >= 18.5 && bmi < 25) return 'You have a normal weight for your height.';
  return 'You are underweight for your height. It\'s important to aim to keep within your healthy weight range.';
};

export default function ModalScreen() {
  const route = useRoute();
  const { bmi, height } = route.params as { bmi: number; height: string }; // Ensure height is being passed here

  const cleanHeightValue = (height: string) => {
    if (typeof height === 'string') {
      const heightInCm = height.match(/(\d+)\s*cm/);
      if (heightInCm) {
        return { value: parseFloat(heightInCm[1]), unit: 'cm' };
      }
      const heightInFtIn = height.match(/(\d+)\s*ft\s*(\d+)\s*in/);
      if (heightInFtIn) {
        const feet = parseFloat(heightInFtIn[1]);
        const inches = parseFloat(heightInFtIn[2]);
        return { value: feet * 30.48 + inches * 2.54, unit: 'ft-in' };
      }
    }
    return { value: parseFloat(height), unit: 'cm' };
  };

  const calculateHealthyWeightRange = (height: string) => {
    const { value: cleanedHeight, unit } = cleanHeightValue(height);
    const minHeightInMeters = cleanedHeight / 100;
    const minWeight = 18.5 * minHeightInMeters * minHeightInMeters;
    const maxWeight = 24.9 * minHeightInMeters * minHeightInMeters;
    if (unit === 'ft-in') {
      const minWeightLb = minWeight * 2.20462;
      const maxWeightLb = maxWeight * 2.20462;
      return { minWeight: minWeightLb.toFixed(1), maxWeight: maxWeightLb.toFixed(1), unit: 'lb' };
    }
    return { minWeight: Math.round(minWeight), maxWeight: Math.round(maxWeight), unit: 'kg' };
  };

  const { minWeight, maxWeight, unit } = calculateHealthyWeightRange(height); // Use height from route
  const bmiDescription = getBmiDescription(bmi);
  const bmiTip = getBmiTip(bmi);

  const { isSwitchOn } = useTheme();
  const backgroundColors = getBackgroundColors(isSwitchOn);
  const textColor = isSwitchOn ? '#fff' : '#333';

  return (
    <LinearGradient
      colors={backgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1 }}
      locations={[0, 1]}
      style={styles.gradient}
    >
        <View style={styles.bmiResultBox}>
          <Text style={styles.resultsTitle}>Your BMI is:</Text>
          <Text style={styles.bmiresultValue}>{bmi}</Text>
          <Text style={styles.bmidescresultValue}>{bmiDescription}</Text>

          
          {/* <View style={styles.resultRow}>
              <Text style={styles.resultTitle}>Your height:</Text>
              <Text style={styles.resultValue}>{height}</Text>
          </View> */}
          {/* <View style={styles.resultRow}>
              <Text style={styles.resultTitle}>Your category:</Text>
              <Text style={styles.resultValue}>{bmiDescription}</Text>
          </View> */}
          <Text style={styles.bmiTipText}>{bmiTip}</Text>

          <Text style={styles.resultTitle}>Healthy weight range:</Text>
          <Text style={styles.resultValue}>{minWeight}{unit} - {maxWeight}{unit}</Text>

          
        </View>

        <View style={styles.separator} />
        
        <Text style={[styles.title, { color: textColor}]}>Guide</Text>

        <View style={styles.guideContainer}>
            <View style={[styles.guideColumn, styles.alignLeft]}>
                <Text style={[styles.guideText, { color: textColor}]}>Underweight</Text>
                <Text style={[styles.guideText, { color: textColor}]}>Normal</Text>
                <Text style={[styles.guideText, { color: textColor}]}>Overweight</Text>
            </View>
            <View style={[styles.guideColumn, styles.alignRight]}>
                <Text style={[styles.guideText, { color: textColor}]}>&lt; 18.5</Text>
                <Text style={[styles.guideText, { color: textColor}]}>18.5 - 24.9</Text>
                <Text style={[styles.guideText, { color: textColor}]}>25 - 29.9</Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  guideColumn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  separatorVertical: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  guideText: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 2,
  },
  bmiResultBox: {
    width: '80%',
    minHeight: 150,
    padding: 16,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: '#fff',
    opacity: 0.8,
    alignItems: 'center',
    marginBottom: 25,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#333',
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginTop: 10,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  bmiresultValue: {
    fontSize: 35,
    fontWeight: '900',
    color: '#333',
  },
  bmidescresultValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  bmiResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  healthyWeightText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  bmiDescriptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  bmiTipText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
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
