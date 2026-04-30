import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { UNIT_GROUPS } from '../../constants/units';

interface Props {
  visible: boolean;
  selected: string;
  onSelect: (unit: string) => void;
  onClose: () => void;
}

export function UnitPicker({ visible, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>Choose Unit</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {UNIT_GROUPS.map(group => (
              <View key={group.category}>
                <Text style={styles.category}>{group.category.toUpperCase()}</Text>
                {group.units.map(unit => {
                  const sel = unit === selected;
                  return (
                    <Pressable
                      key={unit}
                      style={[styles.option, sel && styles.optionSelected]}
                      onPress={() => { onSelect(unit); onClose(); }}
                    >
                      <Text style={[styles.optionText, sel && styles.optionTextSelected]}>
                        {unit}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: Colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingBottom: 12,
    fontFamily: 'serif',
  },
  scroll: { paddingHorizontal: 16 },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 4,
    letterSpacing: 1.2,
  },
  option: { paddingVertical: 15, paddingHorizontal: 16, borderRadius: 12, marginBottom: 2 },
  optionSelected: { backgroundColor: Colors.warmOrangeLight },
  optionText: { fontSize: 18, color: Colors.textPrimary },
  optionTextSelected: { color: Colors.warmOrange, fontWeight: '700' },
});
