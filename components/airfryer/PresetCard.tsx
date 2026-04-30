import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { AirFryerPreset } from '../../types';

interface Props {
  preset: AirFryerPreset;
  onLongPress: () => void;
}

export function PresetCard({ preset, onLongPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <View style={styles.left}>
        <Text style={styles.name}>{preset.foodName}</Text>
        <Text style={styles.hint}>Long press to delete</Text>
      </View>
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.emoji}>🌡</Text>
          <Text style={[styles.value, { color: Colors.warmOrange }]}>{preset.temperature}°C</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.emoji}>⏱</Text>
          <Text style={[styles.value, { color: Colors.sageGreen }]}>{preset.duration} min</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.82 },
  left: { flex: 1 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'serif' },
  hint: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  badges: { gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end' },
  emoji: { fontSize: 18 },
  value: { fontSize: 20, fontWeight: '700', minWidth: 80, textAlign: 'right' },
});
