import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { deleteRecipe, getAllRecipes, getRecipe, saveRecipe } from '../db/recipeDb';
import { Recipe } from '../types';

export function useRecipes() {
  const db = useSQLiteContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const load = useCallback(async () => {
    setRecipes(await getAllRecipes(db));
  }, [db]);

  useEffect(() => { load(); }, [load]);

  const save = async (recipe: Parameters<typeof saveRecipe>[1]) => {
    await saveRecipe(db, recipe);
    await load();
  };

  const remove = async (id: number) => {
    await deleteRecipe(db, id);
    await load();
  };

  const getOne = (id: number) => getRecipe(db, id);

  return { recipes, save, remove, getOne, refresh: load };
}
