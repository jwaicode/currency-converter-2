import { useState, useEffect } from 'react';
import { storage, ExchangeRateData } from '../store/storage';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface UseExchangeRatesResult {
  rates: Record<string, number>;
  isStale: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useExchangeRates(): UseExchangeRatesResult {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isStale, setIsStale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExchangeRates();
  }, []);

  const loadExchangeRates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get saved rates from storage
      const savedData = await storage.getExchangeRates();
      const now = Date.now();

      // Check if we have rates and if they're fresh (less than 24 hours old)
      if (savedData && (now - savedData.lastUpdated) < TWENTY_FOUR_HOURS) {
        // Use cached rates
        setRates(savedData.rates);
        setIsStale(false);
        setIsLoading(false);
        return;
      }

      // If we have stale data, use it temporarily while fetching new data
      if (savedData) {
        setRates(savedData.rates);
        setIsStale(true);
      }

      // Fetch new rates from API
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.rates) {
          const newRatesData: ExchangeRateData = {
            rates: data.rates,
            lastUpdated: now
          };

          // Save new rates to storage
          await storage.setExchangeRates(newRatesData);
          
          // Update state
          setRates(data.rates);
          setIsStale(false);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (fetchError) {
        console.error('Failed to fetch exchange rates:', fetchError);
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch rates');

        // If we have cached data, use it but mark as stale
        if (savedData) {
          setRates(savedData.rates);
          setIsStale(true);
        } else {
          // No cached data and API failed - set default rates
          setRates({});
          setIsStale(true);
        }
      }
    } catch (error) {
      console.error('Error in loadExchangeRates:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setRates({});
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { rates, isStale, isLoading, error };
}