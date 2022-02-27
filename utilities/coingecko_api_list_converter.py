"""
The command for fetching crypto prices (commands/coingecko.js)
Relies on the existence of data/crypto_data.json to fetch the name
of a cryptocurrency from a provided ticker symbol.

data/crypto_data.json is derived from using this script to turn the .csv
downloaded from:
https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0

into a cleaned up JSON.
"""

import simplejson
import pandas as pd


def convert_coingecko_csv() -> None:
    dirty_csv = pd.read_csv("coingecko_token_list.csv")

    # The CSV's dirty. I found out there are have duplicated symbols (possible counterfeit shitcoins)
    clean_csv = dirty_csv.drop_duplicates(subset=['Symbol'], keep='first')
    the_mother_dict: dict = {}


    for row in clean_csv.iterrows():
        # name is the presentable Full Name
        # symbol is the ticker symbol
        # cid is needed to supply arguments to the API endpoint (crypto id)

        list_form = row[1].to_list()
        cid, symbol, name = list_form # Unpack the list to these vars
        the_mother_dict[symbol] = {"name": name, "id": cid}

    the_mother_json = simplejson.dumps(the_mother_dict, ignore_nan=True)
    the_mother_json

    with open('crypto_data.json', 'w') as outfile:
        outfile.write(the_mother_json)
        pass


def main() -> None:
    convert_coingecko_csv()


if __name__ == "__main__":
    main()
