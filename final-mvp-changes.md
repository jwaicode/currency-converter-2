pwa currency converter mvp finish:
""" This final flow will be good experience for my thinking process, how I use cursor (multiple chats/ask other models for fresh eyes/prompt improving ideas/etc), and its an opportunity to utilise a GitHub actions CI to be effective."""

To Do:



- ~~extend currencies.json to include all supported ISO currencies via automated script~~

- calculations within input box feature. (a nice-to have extra)


Completely done:

- Delete button now properly removes the selected row on web and native platforms.

- make caching for offline (!or however id be able to have the app open always if offline, like a native app would - local storage?)

- dark theme. just change the colours so its dark, i dont need a toggle between light and dark. 

- ~~delete button for each row didnt work – fixed by bypassing the web Alert and directly removing the currency~~

- Added `scripts/updateCurrencies.mjs` to automate fetching of up-to-date currency list and regenerated `assets/currencies.json` (170 currencies).


*DONT GET SUCKED INTO ENDLESS IMPROVEMENTS. THIS IS AN MVP. DO THE ABOVE LIST TO LEARN AND THEN MOVE ON!*
