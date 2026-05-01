import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrumRollPicker } from '../../components/airfryer/DrumRollPicker';
import { Colors } from '../../constants/colors';
import { useAirFryer } from '../../hooks/useAirFryer';

const TEMPS = Array.from({ length: 31 }, (_, i) => 80 + i * 5);
const DURATIONS = Array.from({ length: 60 }, (_, i) => i + 1);

export default function AddAirFryerScreen() {
  const { save } = useAirFryer();
  const [foodName, setFoodName] = useState('');
  const [temperature, setTemperature] = useState(200);
  const [duration, setDuration] = useState(20);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Missing name', 'Please enter what you are cooking.');
      return;
    }
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await save({ foodName: foodName.trim(), temperature, duration });
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Air Fryer Preset</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.nameInput}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="What are you cooking?"
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="done"
          autoFocus
        />

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Temperature</Text>
          <Text style={styles.cardValue}>{temperature}°C</Text>
          <DrumRollPicker
            items={TEMPS}
            value={temperature}
            onChange={setTemperature}
            renderLabel={v => `${v}°C`}
            accentColor={Colors.warmOrange}
            highlightColor={Colors.warmOrangeLight}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Duration</Text>
          <Text style={styles.cardValue}>{duration} min</Text>
          <DrumRollPicker
            items={DURATIONS}
            value={duration}
            onChange={setDuration}
            renderLabel={v => `${v} min`}
            accentColor={Colors.sageGreen}
            highlightColor={Colors.sageGreenLight}
          />
        </View>

        <Pressable
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Preset'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { width: 70 },
  backText: { fontSize: 17, color: Colors.warmOrange, fontWeight: '600' },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  content: { flex: 1, padding: 12, gap: 10 },
  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.cardBackground,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'center',
  },
  cardLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 2 },
  cardValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'serif',
  },
  saveBtn: {
    backgroundColor: Colors.sageGreen,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
});
