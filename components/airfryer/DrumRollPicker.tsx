import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';

const ITEM_H = 58;
const VISIBLE = 5;
const PADDING = ITEM_H * Math.floor(VISIBLE / 2);

interface Props {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  renderLabel: (v: number) => string;
  accentColor: string;
  highlightColor: string;
}

export function DrumRollPicker({
  items,
  value,
  onChange,
  renderLabel,
  accentColor,
  highlightColor,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIdx, setSelectedIdx] = useState(() => Math.max(0, items.indexOf(value)));

  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx >= 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: idx * ITEM_H, animated: false });
        setSelectedIdx(idx);
      }, 80);
    }
  }, []);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_H), items.length - 1));
    setSelectedIdx(idx);
    onChange(items[idx]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const step = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(selectedIdx + dir, items.length - 1));
    scrollRef.current?.scrollTo({ y: next * ITEM_H, animated: true });
    setSelectedIdx(next);
    onChange(items[next]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={[styles.stepBtn, { backgroundColor: highlightColor }]} onPress={() => step(-1)}>
        <Text style={[styles.stepText, { color: accentColor }]}>▲</Text>
      </Pressable>

      <View style={styles.pickerContainer}>
        {/* Selection highlight */}
        <View
          style={[
            styles.selectionBar,
            { top: ITEM_H * Math.floor(VISIBLE / 2), backgroundColor: highlightColor },
          ]}
          pointerEvents="none"
        />
        <ScrollView
          ref={scrollRef}
          style={{ height: ITEM_H * VISIBLE }}
          contentContainerStyle={{ paddingVertical: PADDING }}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {items.map((item, idx) => {
            const dist = Math.abs(idx - selectedIdx);
            const opacity = Math.max(0.25, 1 - dist * 0.28);
            const scale = Math.max(0.75, 1 - dist * 0.08);
            const isSelected = idx === selectedIdx;
            return (
              <View key={item} style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    {
                      opacity,
                      transform: [{ scale }],
                      color: isSelected ? accentColor : Colors.textPrimary,
                      fontWeight: isSelected ? '800' : '400',
                      fontSize: isSelected ? 26 : 22,
                    },
                  ]}
                >
                  {renderLabel(item)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Pressable style={[styles.stepBtn, { backgroundColor: highlightColor }]} onPress={() => step(1)}>
        <Text style={[styles.stepText, { color: accentColor }]}>▼</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 18, fontWeight: '700' },
  pickerContainer: {
    flex: 1,
    height: ITEM_H * VISIBLE,
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative',
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_H,
    borderRadius: 12,
    zIndex: 0,
  },
  item: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: { textAlign: 'center' },
});
