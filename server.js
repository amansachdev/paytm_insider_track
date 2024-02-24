const axios = require("axios");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();

// make sure env changes are done
const bot = new TelegramBot(process.env.token_paytm, {
  polling: false,
});

const apiUrl = "https://insider.in/search?q=IPL";
const headers = {
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  Connection: "keep-alive",
  Origin: "https://insider.in",
  Referer: "https://insider.in/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  accept: "application/json",
  "content-type": "application/x-www-form-urlencoded",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "Linux",
};

const chatId = parseInt(process.env.chatId);

const data = {
  requests: [
    {
      indexName: "events",
      params:
        "query=INDIA%20VS%20AFGHA&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&filters=endTime%20%3E%201704513769%20AND%20(NOT%20tagids%3A5836dfe53a3e6042078e2bc6%20)%20%20AND%20(%20tagids%3A5c5d7fc51851a70007eab500%3Cscore%3D1%3E%20OR%20NOT%20tagids%3A5c5d7fc51851a70007eab500%3Cscore%3D0%3E%20)&facets=%5B%5D&tagFilters=",
    },
    {
      indexName: "articles",
      params:
        "query=INDIA%20VS%20AFGHA&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&filters=(%20NOT%20tagids%3A5836dfe53a3e6042078e2bc6%20)&facets=%5B%5D&tagFilters=",
    },
    {
      indexName: "artists",
      params:
        "query=INDIA%20VS%20AFGHA&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters=",
    },
    {
      indexName: "venues",
      params:
        "query=INDIA%20VS%20AFGHA&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters=",
    },
  ],
};

function pollApi() {
  try {
    axios
      .get(apiUrl, data, { headers })
      .then((response) => {
        let isTicketsAvailable = response.data.includes(
          "CSK VS RCB"
        );
        if (isTicketsAvailable) {
          bot.sendMessage(chatId, `Is available ${isTicketsAvailable}`);
        } else {
          console.log(`no tickets`)
        }
      })
      .catch((error) => {
        bot.sendMessage(chatId, `Error occurred ${error?.message}`);
      });
  } catch (error) {
    bot.sendMessage(chatId, `Error occurred ${error?.message}`);
  }
}
pollApi();
setInterval(pollApi, 600000);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
