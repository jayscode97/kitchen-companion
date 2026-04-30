import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kitchen Companion</Text>
        <Text style={styles.subtitle}>What are you making today?</Text>
      </View>

      <View style={styles.grid}>
        <Pressable
          style={({ pressed }) => [styles.card, styles.recipesCard, pressed && styles.cardPressed]}
          onPress={() => router.push('/recipes')}
        >
          <Text style={styles.emoji}>🍽</Text>
          <Text style={styles.cardTitle}>Recipes</Text>
          <Text style={styles.cardSub}>Save & browse your recipes</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, styles.airfryerCard, pressed && styles.cardPressed]}
          onPress={() => router.push('/airfryer')}
        >
          <Text style={styles.emoji}>💨</Text>
          <Text style={styles.cardTitle}>Air Fryer</Text>
          <Text style={styles.cardSub}>Temperature & time presets</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  header: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'serif',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  grid: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 28,
    justifyContent: 'flex-end',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  recipesCard: {
    backgroundColor: Colors.warmOrange,
    shadowColor: Colors.warmOrange,
  },
  airfryerCard: {
    backgroundColor: Colors.sageGreen,
    shadowColor: Colors.sageGreen,
    marginBottom: 28,
  },
  emoji: { fontSize: 52, marginBottom: 12 },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '500',
  },
});
