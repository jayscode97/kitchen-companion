import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Colors } from '../constants/colors';
import { useRecipes } from '../hooks/useRecipes';
import { Recipe } from '../types';

export default function RecipesScreen() {
  const { recipes, remove, refresh } = useRecipes();
  const [toDelete, setToDelete] = useState<Recipe | null>(null);

  useFocusEffect(useCallback(() => { refresh(); }, []));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Recipes</Text>
      </View>

      {recipes.length === 0 ? (
        <EmptyState emoji="🍳" message="No recipes yet!" sub="Tap + to add your first one" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={r => String(r.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => router.push(`/recipe/${item.id}`)}
              onLongPress={() => setToDelete(item)}
            />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/recipe/add')}>
        <Text style={{ fontSize: 36, color: Colors.white, lineHeight: 40 }}>+</Text>
      </Pressable>

      <ConfirmDialog
        visible={!!toDelete}
        title="Delete Recipe?"
        message={`"${toDelete?.name}" will be permanently deleted.`}
        onConfirm={() => { remove(toDelete!.id); setToDelete(null); }}
        onCancel={() => setToDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 17, color: Colors.warmOrange, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, fontFamily: 'serif' },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.warmOrange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warmOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
