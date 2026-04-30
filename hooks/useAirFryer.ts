import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { deletePreset, getAllPresets, savePreset } from '../db/airfryerDb';
import { AirFryerPreset } from '../types';

export function useAirFryer() {
  const db = useSQLiteContext();
  const [presets, setPresets] = useState<AirFryerPreset[]>([]);

  const load = useCallback(async () => {
    setPresets(await getAllPresets(db));
  }, [db]);

  useEffect(() => { load(); }, [load]);

  const save = async (preset: Omit<AirFryerPreset, 'id'>) => {
    await savePreset(db, preset);
    await load();
  };

  const remove = async (id: number) => {
    await deletePreset(db, id);
    await load();
  };

  return { presets, save, remove, refresh: load };
}
