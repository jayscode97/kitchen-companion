export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: number;
  recipeId: number;
  amount: string;
  unit: string;
  name: string;
  sortOrder: number;
}

export interface AirFryerPreset {
  id: number;
  foodName: string;
  temperature: number;
  duration: number;
}

export interface IngredientDraft {
  key: string;
  amount: string;
  unit: string;
  name: string;
}
