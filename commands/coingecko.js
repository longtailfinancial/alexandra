'use strict';
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

// Grabbing JSON to check. 
// It has ticker symbols of all Coingecko listed tokens.
const fs = require('fs');
let rawdata = fs.readFileSync('data/crypto_data.json')
let token_info = JSON.parse(rawdata);

// Provided symbol will be given by discord user
let currency = 'usd'

async function get_token_id(ticker) {

  let token_id = ticker || "btc";

  try {
    token_id = token_info[token_id]['id'];
  } catch (error) {
    console.log(error);
    console.log("Ticker not found. Aborting...")
    return 0;
  }
  console.log("Token found in local JSON")
  return token_id;
}


async function get_token_price(ticker) {
  // We first get the ticker from data/crypto_data.json

  let token_id = await get_token_id(ticker);

  console.log(`${token_id} from get_token_price()`);

  let http_string = `https://api.coingecko.com/api/v3/simple/price?ids=${token_id}&vs_currencies=${currency}`;
  console.log(http_string)

  let token_data = "str";
  await axios.get(http_string)
    .then(res => {
      let headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.status);
      console.log(`Code: ${res.status}. Date in Response header:, ${headerDate}`);

      token_data = res.data;

    }).catch(err => {
      console.log('Error: ', err.message);
    });

  return token_data;
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Check crypto price by ticker symbol.')
    .addStringOption(option =>
      option.setName('ticker')
        .setDescription("The cryptocurrency's ticker symbol [eth, btc, cro, etc..]")
        .setRequired(true)),
  async execute(interaction) {


    let input_string = interaction.options.getString("ticker");
    let token_info = ""

    get_token_price(input_string).then((res) => {

      console.log(Object.keys(res))
      if (Object.keys(res).length === 0) {
        let response = "API returned nothing."
        token_info = response;
      } else {
        //let parsed = JSON.stringify(res);
        let token_name = Object.keys(res)[0];

        // Grabbing the value of the value and turning the result into a string. 
        let token_price = Object.values(Object.values(res)[0]).toString();
        token_info = `Current price of ${token_name} token is: $${token_price} USD.`;
      }

      interaction.reply({
        content: token_info || "Not found.",
        ephemeral: false,
      });

    })

  }
};
