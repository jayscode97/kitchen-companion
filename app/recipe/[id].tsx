import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useRecipes } from '../../hooks/useRecipes';
import { Recipe } from '../../types';

export default function ViewRecipePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOne } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    getOne(Number(id)).then(setRecipe);
  }, [id]);

  if (!recipe) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(`/recipe/edit/${recipe.id}`)}
          style={styles.editBtn}
          hitSlop={10}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{recipe.name}</Text>

        {!!recipe.description && (
          <View style={styles.descCard}>
            <Text style={styles.descText}>{recipe.description}</Text>
          </View>
        )}

        {recipe.ingredients.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Ingredients</Text>
            <View style={styles.ingredientCard}>
              {recipe.ingredients.map((ing, idx) => (
                <View key={ing.id}>
                  <View style={styles.ingRow}>
                    <View style={styles.ingLeft}>
                      {!!ing.amount && (
                        <Text style={styles.ingAmount}>{ing.amount}</Text>
                      )}
                      {!!ing.unit && (
                        <Text style={styles.ingUnit}>{ing.unit}</Text>
                      )}
                    </View>
                    <Text style={styles.ingName}>{ing.name}</Text>
                  </View>
                  {idx < recipe.ingredients.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {},
  backText: { fontSize: 17, color: Colors.warmOrange, fontWeight: '600' },
  editBtn: {},
  editText: { fontSize: 17, color: Colors.warmOrange, fontWeight: '700' },
  scroll: { padding: 20 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    marginBottom: 16,
    lineHeight: 40,
  },
  descCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  descText: { fontSize: 17, color: Colors.textSecondary, lineHeight: 26 },
  sectionLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    marginBottom: 14,
  },
  ingredientCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    gap: 14,
  },
  ingLeft: { width: 82, alignItems: 'flex-end' },
  ingAmount: { fontSize: 20, fontWeight: '800', color: Colors.warmOrange },
  ingUnit: { fontSize: 14, fontWeight: '600', color: Colors.sageGreen, marginTop: 1 },
  ingName: { flex: 1, fontSize: 18, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 18 },
});
