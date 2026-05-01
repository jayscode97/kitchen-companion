import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useRecipes } from '../../hooks/useRecipes';
import { IngredientDraft } from '../../types';
import { AmountNumpad } from './AmountNumpad';
import { IngredientRowInput } from './IngredientRowInput';
import { UnitPicker } from './UnitPicker';

const newRow = (): IngredientDraft => ({
  key: String(Date.now() + Math.random()),
  amount: '',
  unit: '',
  name: '',
});

interface Props {
  recipeId?: number;
}

export function RecipeFormScreen({ recipeId }: Props) {
  const { save, getOne } = useRecipes();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([newRow()]);
  const [saving, setSaving] = useState(false);

  const [numpadKey, setNumpadKey] = useState<string | null>(null);
  const [unitKey, setUnitKey] = useState<string | null>(null);

  const activeRow = ingredients.find(r => r.key === numpadKey);
  const activeUnitRow = ingredients.find(r => r.key === unitKey);

  useEffect(() => {
    if (!recipeId) return;
    getOne(recipeId).then(recipe => {
      if (!recipe) return;
      setName(recipe.name);
      setDescription(recipe.description);
      setInstructions(recipe.instructions);
      setIngredients(
        recipe.ingredients.length
          ? recipe.ingredients.map(ing => ({
              key: String(ing.id),
              amount: ing.amount,
              unit: ing.unit,
              name: ing.name,
            }))
          : [newRow()]
      );
    });
  }, [recipeId]);

  const updateIngredient = (key: string, field: keyof IngredientDraft, value: string) => {
    setIngredients(prev =>
      prev.map(r => (r.key === key ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a recipe name.');
      return;
    }
    setSaving(true);
    await save({
      id: recipeId,
      name: name.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      ingredients: ingredients
        .filter(r => r.name.trim() || r.amount.trim())
        .map(r => ({ amount: r.amount, unit: r.unit, name: r.name.trim() })),
    });
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{recipeId ? 'Edit Recipe' : 'New Recipe'}</Text>
        <View style={{ width: 70 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Recipe Name"
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="next"
          />

          <TextInput
            style={styles.descInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Description / Notes (optional)"
            placeholderTextColor={Colors.textSecondary}
            multiline
            returnKeyType="next"
          />

          <Text style={styles.sectionLabel}>Ingredients</Text>

          {ingredients.map((row, idx) => (
            <IngredientRowInput
              key={row.key}
              row={row}
              onAmountPress={() => setNumpadKey(row.key)}
              onUnitPress={() => setUnitKey(row.key)}
              onNameChange={v => updateIngredient(row.key, 'name', v)}
              onRemove={() =>
                setIngredients(prev => prev.filter(r => r.key !== row.key))
              }
              showRemove={ingredients.length > 1}
            />
          ))}

          <Pressable style={styles.addRowBtn} onPress={() => setIngredients(prev => [...prev, newRow()])}>
            <Text style={styles.addRowText}>+ Add Ingredient</Text>
          </Pressable>

          <Text style={styles.sectionLabel}>Cooking Instructions</Text>
          <TextInput
            style={styles.instructionsInput}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Step 1: Preheat oven to 180°C..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Recipe'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <AmountNumpad
        visible={!!numpadKey}
        initialValue={activeRow?.amount ?? ''}
        onDone={v => { updateIngredient(numpadKey!, 'amount', v); setNumpadKey(null); }}
        onCancel={() => setNumpadKey(null)}
      />

      <UnitPicker
        visible={!!unitKey}
        selected={activeUnitRow?.unit ?? ''}
        onSelect={v => updateIngredient(unitKey!, 'unit', v)}
        onClose={() => setUnitKey(null)}
      />
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
  scroll: { padding: 16, paddingBottom: 40 },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.cardBackground,
    marginBottom: 12,
    fontFamily: 'serif',
  },
  descInput: {
    fontSize: 17,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.cardBackground,
    marginBottom: 20,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    marginBottom: 12,
  },
  addRowBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  instructionsInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.cardBackground,
    marginBottom: 24,
    minHeight: 140,
    lineHeight: 24,
  },
  addRowText: { fontSize: 18, color: Colors.sageGreen, fontWeight: '700' },
  saveBtn: {
    backgroundColor: Colors.warmOrange,
    borderRadius: 18,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warmOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 20, fontWeight: '700', color: Colors.white },
});
