import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { filterCurrencies, CurrencyMeta } from '../utils/filterCurrencies';
import { colors } from '../utils/colors';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCurrency: (iso: string) => void;
  selectedCurrencies: string[];
}

export function SearchModal({
  visible,
  onClose,
  onSelectCurrency,
  selectedCurrencies,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyMeta[]>([]);

  useEffect(() => {
    const results = filterCurrencies(query);
    // Filter out already selected currencies
    const availableResults = results.filter(
      currency => !selectedCurrencies.includes(currency.iso)
    );
    setFilteredCurrencies(availableResults);
  }, [query, selectedCurrencies]);

  const handleSelectCurrency = (currency: CurrencyMeta) => {
    onSelectCurrency(currency.iso);
    onClose();
    setQuery(''); // Reset search when closing
  };

  const handleClose = () => {
    setQuery(''); // Reset search when closing
    onClose();
  };

  const renderCurrencyItem = ({ item }: { item: CurrencyMeta }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => handleSelectCurrency(item)}
    >
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyIso}>{item.iso}</Text>
        <Text style={styles.currencyName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Currency</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search currencies..."
            value={query}
            onChangeText={setQuery}
            autoFocus={true}
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredCurrencies}
          renderItem={renderCurrencyItem}
          keyExtractor={item => item.iso}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: colors.inputBg,
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  currencyItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyIso: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 50,
  },
  currencyName: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
});