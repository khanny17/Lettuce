Lettuce    <img src="https://travis-ci.org/khanny17/Lettuce.svg?branch=master" />
=======

Riot Api Challenge 2016

A web application to allow League of Legends players to plan and communicate with their friends before getting into a game. Players can create a team page for their team, and then register a user on their team's page. This gives them access to the functionality of the site. For more information check out our wiki.

Demo
----
http://www.lettucelol.com


Setup
-----

1. Install NodeJS on your machine
2. Download code
3. Install npm
4. Go into code directory, run __npm install__
5. Install bower (__npm install -g bower__)
6. Run __bower install__
7. Run __npm install -g gulp__
8. Change the *DB url* and *secret* in the *config.dev.js* file to your own personal database url.
9. Create a .env file based on the SAMPLE_ENV file
10. Run __gulp run__

Creating a Team Page (on the demo site)
--------------------
1. Go to http://www.lettucelol.com (or your local url localhost:(port))
2. Click on "Create a Team Page Now"
3. Type in a team name and a tag, click "Create"
4. A message should appear saying Success. Click on the link to be taken to your team's page

Creating a Comp
---------------
1. Once you have created a Team Page, open it
2. Register as a user on the site by clicking "Register" in the top navbar
3. Complete the modal and press "Register"
4. This may take some time - be patient
5. Once you are registered, the modal will close. Click on "Comps" in the top navbar
6. Click on "Create a comp"
7. Enter a name for your comp and click Create. The site should redirect you once the comp has been created

Using the Comp Builder
----------------------
You can add filters using the plus button next to the select box in every column. There are a few different types of filters:
* Ban - removes a champion from the list
* Role - removes champions who are not tagged with that given role (ie Tank, Fighter, Mage, Assassin, Support, Marksman)
* Summoner - sorts the list by champion mastery - make sure you have registered that summoner name with the site!

You can also type a champion's name into the "Champion Name" input box to find a specific champion.

Editing filters will live update to any connected users looking at the same comp page

You can indicate a champion you intend to play by clicking on their image. This will outline the image in blue, and also update the name at the top of the lane column.





