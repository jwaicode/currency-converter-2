import currenciesData from '../assets/currencies.json';

export interface CurrencyMeta {
  iso: string;
  name: string;
  aliases: string[];
}

export const currencies: CurrencyMeta[] = currenciesData;

export function filterCurrencies(query: string): CurrencyMeta[] {
  if (!query.trim()) {
    return currencies;
  }

  const queryLower = query.toLowerCase();

  return currencies.filter(currency => {
    // Check ISO code
    if (currency.iso.toLowerCase().includes(queryLower)) {
      return true;
    }

    // Check name
    if (currency.name.toLowerCase().includes(queryLower)) {
      return true;
    }

    // Check aliases
    return currency.aliases.some(alias => 
      alias.toLowerCase().includes(queryLower)
    );
  });
}

export function validateNumericInput(input: string): boolean {
  // Check max length
  if (input.length > 12) {
    return false;
  }

  // Allow empty string
  if (input === '') {
    return true;
  }

  // Check for valid numeric characters (digits and one decimal point)
  const numericRegex = /^[0-9]*\.?[0-9]*$/;
  if (!numericRegex.test(input)) {
    return false;
  }

  // Check for multiple decimal points
  const decimalCount = (input.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return false;
  }

  // Try to parse as float
  const parsed = parseFloat(input);
  return !isNaN(parsed) || input === '' || input === '.';
}