import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
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
    setActiveInput(iso, activeValue);
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
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.content}>
          <FlatList
            data={selectedCurrencies}
            renderItem={renderCurrencyRow}
            keyExtractor={(item) => item}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </TouchableWithoutFeedback>

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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  staleWarning: {
    fontSize: 14,
    color: '#ff8c00',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});