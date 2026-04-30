import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { IngredientDraft } from '../../types';

interface Props {
  row: IngredientDraft;
  onAmountPress: () => void;
  onUnitPress: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function IngredientRowInput({
  row,
  onAmountPress,
  onUnitPress,
  onNameChange,
  onRemove,
  showRemove,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.amountChip} onPress={onAmountPress}>
        <Text style={styles.amountText}>{row.amount || '0'}</Text>
      </Pressable>

      <Pressable style={styles.unitChip} onPress={onUnitPress}>
        <Text style={[styles.unitText, !row.unit && styles.placeholder]}>
          {row.unit || 'unit'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.nameInput}
        value={row.name}
        onChangeText={onNameChange}
        placeholder="ingredient"
        placeholderTextColor={Colors.textSecondary}
        returnKeyType="next"
        autoCorrect={false}
      />

      {showRemove ? (
        <Pressable style={styles.removeBtn} onPress={onRemove} hitSlop={10}>
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      ) : (
        <View style={styles.removeBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 10,
    gap: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  amountChip: {
    backgroundColor: Colors.warmOrangeLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minWidth: 52,
    alignItems: 'center',
  },
  amountText: { fontSize: 18, fontWeight: '700', color: Colors.warmOrange },
  unitChip: {
    backgroundColor: Colors.softCream,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.divider,
    minWidth: 56,
    alignItems: 'center',
  },
  unitText: { fontSize: 15, color: Colors.textPrimary },
  placeholder: { color: Colors.textSecondary },
  nameInput: {
    flex: 1,
    fontSize: 17,
    color: Colors.textPrimary,
    backgroundColor: Colors.warmWhite,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.divider,
    minHeight: 46,
  },
  removeBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  removeText: { fontSize: 24, color: Colors.textSecondary, lineHeight: 30 },
});
