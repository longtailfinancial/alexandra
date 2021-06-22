<div align="center">
<h1>
  Alexandra

</h1>
</div>

![](https://github.com/JohannSuarez/alexandra/actions/workflows/node.js.yml/badge.svg) 


A package for bots to track user presence in Discord voice channels, named after our own bot who was made for this purpose. 



## Installation ( In-Progress )


### install.sh

The app will come with an installation
shell script that checks for all required 
dependencies

* Checks for python3
* installs nodejs & npm
* installs ripgrep
* runs npm install



## Directories

#### timelog/
This directory will hold the time logging information gathered
by your Discord bot, in either JSON or CSV (must be configured). 

#### utilities/
The utilities folder is where occasionally needed but mostly unimportant scripts are kept. Usually, the scripts found in this directory are temporary features/fixes that are later given a better official implementation.

### node_modules/
Self explanatory. All node modules needed by the app will be kept here.


### tests/

Alexandra uses the jest testing framework. 
Testing modules are kept here, and are invoked using
**npm run test**.

#### Notable Files
* .env
* admin_list.txt


## Usage
  

#### Deploying your bot


The node app requires an .env in src folder.
You must populate this .env with your Discord bot's token,
your Github organization name (if you have one), 
and a Github access token for the app to access the 
Github API. The Github access token will be required 
for diagnostic admin commands such as:
- Listing Github organization members.
- Gathering information about any/all repositories within your organization.


I will create a video tutorial in the near future 
for a full showcase of this product.
