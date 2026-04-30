import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Recipe } from '../../types';

interface Props {
  recipe: Recipe;
  onPress: () => void;
  onLongPress: () => void;
}

export function RecipeCard({ recipe, onPress, onLongPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <Text style={styles.name}>{recipe.name}</Text>
      {!!recipe.description && (
        <Text style={styles.desc} numberOfLines={2}>{recipe.description}</Text>
      )}
      {recipe.ingredients.length > 0 && (
        <Text style={styles.count}>
          {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'serif' },
  desc: { fontSize: 16, color: Colors.textSecondary, marginTop: 6, lineHeight: 23 },
  count: { fontSize: 14, color: Colors.warmOrange, marginTop: 10, fontWeight: '700' },
});
