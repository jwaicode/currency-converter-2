import { useState, useEffect, useCallback } from 'react';
import { storage } from '../store/storage';

export interface UseCurrencyConverterResult {
  selectedCurrencies: string[];
  activeIso: string | null;
  activeValue: string;
  convertedValues: Record<string, number | null>;
  addCurrency: (isoCode: string) => Promise<void>;
  removeCurrency: (isoCode: string) => Promise<void>;
  setActiveInput: (isoCode: string, value: string) => void;
  clearActiveInput: () => void;
}

export function useCurrencyConverter(rates: Record<string, number>): UseCurrencyConverterResult {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [activeIso, setActiveIso] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [convertedValues, setConvertedValues] = useState<Record<string, number | null>>({});

  // Load selected currencies on mount
  useEffect(() => {
    loadSelectedCurrencies();
  }, []);

  // Recalculate conversions when active value, active ISO, or rates change
  useEffect(() => {
    if (activeIso && activeValue && rates) {
      const newConvertedValues = convertAllValues(activeIso, parseFloat(activeValue) || 0, rates);
      setConvertedValues(newConvertedValues);
    } else {
      setConvertedValues({});
    }
  }, [activeIso, activeValue, rates, selectedCurrencies]);

  const loadSelectedCurrencies = async () => {
    const currencies = await storage.getSelectedCurrencies();
    setSelectedCurrencies(currencies);
  };

  const addCurrency = useCallback(async (isoCode: string) => {
    const updatedCurrencies = [...selectedCurrencies];
    
    // Only add if not already present
    if (!updatedCurrencies.includes(isoCode)) {
      updatedCurrencies.push(isoCode);
      
      // Save to storage
      await storage.setSelectedCurrencies(updatedCurrencies);
      
      // Update state
      setSelectedCurrencies(updatedCurrencies);
    }
  }, [selectedCurrencies]);

  const removeCurrency = useCallback(async (isoCode: string) => {
    const updatedCurrencies = selectedCurrencies.filter(iso => iso !== isoCode);
    
    // Save to storage
    await storage.setSelectedCurrencies(updatedCurrencies);
    
    // Update state
    setSelectedCurrencies(updatedCurrencies);
    
    // Clear active input if removing the active currency
    if (activeIso === isoCode) {
      setActiveIso(null);
      setActiveValue('');
    }
  }, [selectedCurrencies, activeIso]);

  const setActiveInput = useCallback((isoCode: string, value: string) => {
    setActiveIso(isoCode);
    setActiveValue(value);
  }, []);

  const clearActiveInput = useCallback(() => {
    setActiveIso(null);
    setActiveValue('');
  }, []);

  return {
    selectedCurrencies,
    activeIso,
    activeValue,
    convertedValues,
    addCurrency,
    removeCurrency,
    setActiveInput,
    clearActiveInput
  };
}

function convertAllValues(
  activeIso: string,
  activeValue: number,
  rates: Record<string, number>
): Record<string, number | null> {
  const resultMap: Record<string, number | null> = {};

  // Check if we have a rate for the active currency
  if (!rates[activeIso] || rates[activeIso] === 0) {
    // If no rate for active currency, return null for all
    return {};
  }

  // Convert active value to USD first
  const activeToUSD = activeValue / rates[activeIso];

  // Convert USD to all other currencies
  Object.keys(rates).forEach(iso => {
    if (rates[iso] && rates[iso] !== 0) {
      if (iso === activeIso) {
        resultMap[iso] = activeValue;
      } else {
        resultMap[iso] = Math.round(activeToUSD * rates[iso] * 100) / 100; // Round to 2 decimal places
      }
    } else {
      resultMap[iso] = null;
    }
  });

  return resultMap;
}