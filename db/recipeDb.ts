import { SQLiteDatabase } from 'expo-sqlite';
import { Ingredient, Recipe } from '../types';

type RecipeRow = { id: number; name: string; description: string; instructions: string };
type IngRow = {
  id: number;
  recipe_id: number;
  amount: string;
  unit: string;
  name: string;
  sort_order: number;
};

function rowToIngredient(r: IngRow): Ingredient {
  return {
    id: r.id,
    recipeId: r.recipe_id,
    amount: r.amount,
    unit: r.unit,
    name: r.name,
    sortOrder: r.sort_order,
  };
}

export async function getAllRecipes(db: SQLiteDatabase): Promise<Recipe[]> {
  const recipes = await db.getAllAsync<RecipeRow>('SELECT * FROM recipes ORDER BY name ASC');
  const result: Recipe[] = [];
  for (const r of recipes) {
    const ings = await db.getAllAsync<IngRow>(
      'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order ASC',
      r.id
    );
    result.push({ ...r, instructions: r.instructions ?? '', ingredients: ings.map(rowToIngredient) });
  }
  return result;
}

export async function getRecipe(db: SQLiteDatabase, id: number): Promise<Recipe | null> {
  const r = await db.getFirstAsync<RecipeRow>('SELECT * FROM recipes WHERE id = ?', id);
  if (!r) return null;
  const ings = await db.getAllAsync<IngRow>(
    'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order ASC',
    id
  );
  return { ...r, instructions: r.instructions ?? '', ingredients: ings.map(rowToIngredient) };
}

export async function saveRecipe(
  db: SQLiteDatabase,
  recipe: {
    id?: number;
    name: string;
    description: string;
    instructions: string;
    ingredients: { amount: string; unit: string; name: string }[];
  }
): Promise<number> {
  let recipeId = recipe.id ?? 0;
  if (!recipeId) {
    const res = await db.runAsync(
      'INSERT INTO recipes (name, description, instructions) VALUES (?, ?, ?)',
      recipe.name,
      recipe.description,
      recipe.instructions
    );
    recipeId = res.lastInsertRowId;
  } else {
    await db.runAsync(
      'UPDATE recipes SET name = ?, description = ?, instructions = ? WHERE id = ?',
      recipe.name,
      recipe.description,
      recipe.instructions,
      recipeId
    );
  }
  await db.runAsync('DELETE FROM ingredients WHERE recipe_id = ?', recipeId);
  for (let i = 0; i < recipe.ingredients.length; i++) {
    const ing = recipe.ingredients[i];
    await db.runAsync(
      'INSERT INTO ingredients (recipe_id, amount, unit, name, sort_order) VALUES (?, ?, ?, ?, ?)',
      recipeId,
      ing.amount,
      ing.unit,
      ing.name,
      i
    );
  }
  return recipeId;
}

export async function deleteRecipe(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM recipes WHERE id = ?', id);
}
