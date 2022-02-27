# Sandy

General Purpose Discord Bot 

Features: Crytpocurrency Price Tracking
          Voice Channel Time Logging
          
    
### Directories:
- **commands** - Discord server commands are separated into files that are individually loaded during startup. 

- **data** - Server commands may refer to JSONs or CSVs in order to work. They're kept here.

- **utilities** - Scripts that are handy to keep around during development. For example, there is a script prepares data to be used by a command, and a template systemd unit file.

- **events** - DiscordJS takes advantage of NodeJS's event-driven architecture. Events are registered in individual event files and kept here for modularity.

- **include** - Commands and events may be complex enough to warrant importing other files. In that case, the code from external files is kept here. ***index.js*** also needs a ***config.json*** in root. An example ***config.json*** is provided here.

- **timelog** - Data collected by include/csv_logging.js is saved here, with one .csv file for each day

### Installation:

- **npm install** the prerequisites.

- Copy the template ***utilities/exampleconfig.json*** to ***config.json***. Fill up the fields with your server's information.

- For the */price* command to work, you need ***data/cryptodata.json***. Refer to the instructions in ***utilities/coingeckoapilistconverter.py*** to download the .csv and convert it to ***cryptodata.json***

- Test if the bot can launch using **npm run update_run**
	
- If the bot can run, you may proceed to setting up the bot to run as a background process using a systemd unit. Copy ***utilities/sandy.service*** to ***/etc/systemd/system/sandy.service*** and fill the path information. Remember to enable the service using **systemctl enable sandy**.
