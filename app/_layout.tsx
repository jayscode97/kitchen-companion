import { Stack } from 'expo-router';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { migrateDbIfNeeded } from '../db/database';
import { Colors } from '../constants/colors';

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.warmWhite }}>
      <ActivityIndicator size="large" color={Colors.warmOrange} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName="kitchen.db" onInit={migrateDbIfNeeded} useSuspense>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </Suspense>
  );
}
