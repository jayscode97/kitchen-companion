import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PresetCard } from '../../components/airfryer/PresetCard';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors } from '../../constants/colors';
import { useAirFryer } from '../../hooks/useAirFryer';
import { AirFryerPreset } from '../../types';

export default function AirFryerScreen() {
  const { presets, remove } = useAirFryer();
  const [toDelete, setToDelete] = useState<AirFryerPreset | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Air Fryer</Text>
      </View>

      {presets.length === 0 ? (
        <EmptyState
          emoji="💨"
          message="No presets yet!"
          sub="Tap + to save your first air fryer setting"
        />
      ) : (
        <FlatList
          data={presets}
          keyExtractor={p => String(p.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <PresetCard preset={item} onLongPress={() => setToDelete(item)} />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/airfryer/add')}>
        <Ionicons name="add" size={34} color={Colors.white} />
      </Pressable>

      <ConfirmDialog
        visible={!!toDelete}
        title="Delete Preset?"
        message={`"${toDelete?.foodName}" will be permanently deleted.`}
        onConfirm={() => { remove(toDelete!.id); setToDelete(null); }}
        onCancel={() => setToDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 14 },
  title: { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, fontFamily: 'serif' },
  list: { paddingHorizontal: 16, paddingTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.sageGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
