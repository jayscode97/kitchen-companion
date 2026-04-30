import { useLocalSearchParams } from 'expo-router';
import { RecipeFormScreen } from '../../../components/recipes/RecipeFormScreen';

export default function EditRecipePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RecipeFormScreen recipeId={Number(id)} />;
}
