import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { validateNumericInput } from '../utils/filterCurrencies';
import { currencies } from '../utils/filterCurrencies';
import { colors } from '../utils/colors';

interface CurrencyRowProps {
  iso: string;
  value: string;
  convertedValue: number | null;
  isActive: boolean;
  onValueChange: (value: string) => void;
  onFocus: () => void;
  onRemove: () => void;
}

export function CurrencyRow({
  iso,
  value,
  convertedValue,
  isActive,
  onValueChange,
  onFocus,
  onRemove
}: CurrencyRowProps) {
  const currency = currencies.find(c => c.iso === iso);
  const displayName = currency ? currency.name : iso;

  const handleTextChange = (text: string) => {
    if (validateNumericInput(text)) {
      onValueChange(text);
    }
  };

  const displayValue = isActive ? value : (convertedValue?.toFixed(2) || '');

  // Always place the caret at the end of the text when this row is active so
  // that a user can immediately back-space the existing value. When the row is
  // inactive we don’t provide an explicit selection.
  const caretSelection = isActive
    ? { start: displayValue.length, end: displayValue.length }
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.isoCode}>{iso}</Text>
        <Text style={styles.currencyName}>{displayName}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <TextInput
          style={[styles.input, isActive && styles.activeInput]}
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={onFocus}
          keyboardType="numeric"
          placeholder="0.00"
          editable={true}
          // Let the cursor appear at the end of the input to facilitate easy back-spacing.
          selectTextOnFocus={false}
          selection={caretSelection as any}
        />
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  isoCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  currencyName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  input: {
    minWidth: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
  },
  activeInput: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});