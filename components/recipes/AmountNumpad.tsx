import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

interface Props {
  visible: boolean;
  initialValue: string;
  onDone: (value: string) => void;
  onCancel: () => void;
}

const PRESETS = [
  { label: '¼', value: '0.25' },
  { label: '½', value: '0.5' },
  { label: '¾', value: '0.75' },
  { label: '1½', value: '1.5' },
  { label: '2½', value: '2.5' },
];

const ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
];

export function AmountNumpad({ visible, initialValue, onDone, onCancel }: Props) {
  const [current, setCurrent] = useState(initialValue);

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setCurrent(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (!current.includes('.')) setCurrent(prev => prev + '.');
    } else {
      setCurrent(prev => (prev === '0' || prev === '') ? key : prev + key);
    }
  };

  const handleDone = () => {
    const trimmed = current.replace(/\.$/, '');
    onDone(trimmed);
    setCurrent('');
  };

  const handleCancel = () => {
    setCurrent(initialValue);
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.display}>{current || '0'}</Text>

          <View style={styles.presetRow}>
            {PRESETS.map(p => (
              <Pressable key={p.label} style={styles.presetBtn} onPress={() => setCurrent(p.value)}>
                <Text style={styles.presetText}>{p.label}</Text>
              </Pressable>
            ))}
          </View>

          {ROWS.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(key => (
                <Pressable
                  key={key}
                  style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
                  onPress={() => handleKey(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
  },
  display: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.warmOrange,
    textAlign: 'center',
    marginBottom: 16,
  },
  presetRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  presetBtn: {
    flex: 1,
    backgroundColor: Colors.softCream,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  presetText: { fontSize: 17, color: Colors.warmOrange, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  key: {
    flex: 1,
    backgroundColor: Colors.softCream,
    borderRadius: 14,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: { backgroundColor: Colors.divider },
  keyText: { fontSize: 28, fontWeight: '500', color: Colors.textPrimary },
  doneBtn: {
    backgroundColor: Colors.warmOrange,
    borderRadius: 16,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  doneText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  cancelBtn: { alignItems: 'center', justifyContent: 'center', height: 50, marginTop: 4 },
  cancelText: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
});
