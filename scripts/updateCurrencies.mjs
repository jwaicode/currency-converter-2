import { writeFile } from 'node:fs/promises';
import https from 'node:https';

/**
 * Fetch JSON from the provided URL.
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

async function main() {
  // Open Exchange Rates offers a free currency list endpoint that does not
  // require an API key (unlike their rates endpoints). It returns an object
  // mapping ISO code to full currency name.
  const CURRENCIES_URL = 'https://openexchangerates.org/api/currencies.json';

  console.log('Fetching currency list…');
  const mapping = await fetchJson(CURRENCIES_URL);

  // Transform into array sorted alphabetically by ISO for stable output.
  const currenciesArray = Object.entries(mapping)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, name]) => ({
      iso,
      name,
      aliases: [iso.toLowerCase()],
    }));

  const jsonStr = JSON.stringify(currenciesArray, null, 2) + '\n';
  const outPath = new URL('../currency-converter-app/assets/currencies.json', import.meta.url);

  await writeFile(outPath, jsonStr, 'utf8');
  console.log(`Wrote ${currenciesArray.length} currencies to ${outPath.pathname}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 