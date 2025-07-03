import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CURRENCIES_KEY = 'selectedCurrencies';
const EXCHANGE_RATES_KEY = 'exchangeRates';

export interface ExchangeRateData {
  rates: Record<string, number>;
  lastUpdated: number;
}

export const storage = {
  async getSelectedCurrencies(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(SELECTED_CURRENCIES_KEY);
      return stored ? JSON.parse(stored) : ['USD', 'EUR', 'GBP']; // Default currencies
    } catch (error) {
      console.error('Error loading selected currencies:', error);
      return ['USD', 'EUR', 'GBP'];
    }
  },

  async setSelectedCurrencies(currencies: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SELECTED_CURRENCIES_KEY, JSON.stringify(currencies));
    } catch (error) {
      console.error('Error saving selected currencies:', error);
    }
  },

  async getExchangeRates(): Promise<ExchangeRateData | null> {
    try {
      const stored = await AsyncStorage.getItem(EXCHANGE_RATES_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      return null;
    }
  },

  async setExchangeRates(data: ExchangeRateData): Promise<void> {
    try {
      await AsyncStorage.setItem(EXCHANGE_RATES_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving exchange rates:', error);
    }
  }
};