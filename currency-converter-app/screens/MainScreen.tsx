import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import { colors } from '../utils/colors';
import { CurrencyRow } from '../components/CurrencyRow';
import { AddCurrencyButton } from '../components/AddCurrencyButton';
import { SearchModal } from '../components/SearchModal';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';

export function MainScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { rates, isStale, isLoading, error } = useExchangeRates();
  const {
    selectedCurrencies,
    activeIso,
    activeValue,
    convertedValues,
    addCurrency,
    removeCurrency,
    setActiveInput,
    clearActiveInput,
  } = useCurrencyConverter(rates);

  const handleAddCurrency = async (iso: string) => {
    await addCurrency(iso);
    setIsModalVisible(false);
  };

  const handleRemoveCurrency = (iso: string) => {
    Alert.alert(
      'Remove Currency',
      `Remove ${iso} from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeCurrency(iso) },
      ]
    );
  };

  const handleRowFocus = (iso: string) => {
    // Determine the value that is currently displayed for the tapped row. If the
    // row was already active, keep its activeValue. Otherwise, use the last
    // converted value that had been calculated for that currency (or empty
    // string if none). This prevents the newly-focused row from inheriting the
    // previously active row’s amount.
    const newValue =
      iso === activeIso
        ? activeValue
        : convertedValues[iso] !== undefined && convertedValues[iso] !== null
          ? convertedValues[iso].toString()
          : '';

    setActiveInput(iso, newValue);
  };

  const handleRowValueChange = (iso: string, value: string) => {
    setActiveInput(iso, value);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderCurrencyRow = ({ item: iso }: { item: string }) => (
    <CurrencyRow
      iso={iso}
      value={activeIso === iso ? activeValue : ''}
      convertedValue={convertedValues[iso] || null}
      isActive={activeIso === iso}
      onValueChange={(value) => handleRowValueChange(iso, value)}
      onFocus={() => handleRowFocus(iso)}
      onRemove={() => handleRemoveCurrency(iso)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Currency Converter</Text>
      {isStale && (
        <Text style={styles.staleWarning}>
          ⚠️ Exchange rates may be outdated
        </Text>
      )}
      {error && (
        <Text style={styles.errorText}>
          Failed to fetch latest rates
        </Text>
      )}
      {isLoading && (
        <Text style={styles.loadingText}>
          Loading exchange rates...
        </Text>
      )}
    </View>
  );

  const renderFooter = () => (
    <AddCurrencyButton onPress={() => setIsModalVisible(true)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={selectedCurrencies}
          renderItem={renderCurrencyRow}
          keyExtractor={(item) => item}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={dismissKeyboard}
        />
      </View>

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectCurrency={handleAddCurrency}
        selectedCurrencies={selectedCurrencies}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  staleWarning: {
    fontSize: 14,
    color: colors.stale,
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});