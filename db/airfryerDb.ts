import { SQLiteDatabase } from 'expo-sqlite';
import { AirFryerPreset } from '../types';

type PresetRow = { id: number; food_name: string; temperature: number; duration: number };

function rowToPreset(r: PresetRow): AirFryerPreset {
  return { id: r.id, foodName: r.food_name, temperature: r.temperature, duration: r.duration };
}

export async function getAllPresets(db: SQLiteDatabase): Promise<AirFryerPreset[]> {
  const rows = await db.getAllAsync<PresetRow>(
    'SELECT * FROM air_fryer_presets ORDER BY food_name ASC'
  );
  return rows.map(rowToPreset);
}

export async function savePreset(
  db: SQLiteDatabase,
  preset: Omit<AirFryerPreset, 'id'>
): Promise<number> {
  const res = await db.runAsync(
    'INSERT INTO air_fryer_presets (food_name, temperature, duration) VALUES (?, ?, ?)',
    preset.foodName,
    preset.temperature,
    preset.duration
  );
  return res.lastInsertRowId;
}

export async function deletePreset(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM air_fryer_presets WHERE id = ?', id);
}
