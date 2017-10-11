# AdminRCON
A simple webapp for executing commands on a Source gameserver. Made mainly for TF2 but is configurable for all Source games.

## Goals
- Simple to use
- Simple to configure

## TFRCON
TFRCON is the main implementation of AdminRCON. It conains popular Team Fortress 2 maps and competitive configs. To see AdminRCON in action go to [tfrcon.net](http://tfrcon.net).

## Requirements
Nodejs and npm, preferably the latest version.

## Usage
View [help](http://tfrcon.net/help) for help with using the app.

## Configuration
The main configuration is located in `/config/default.json`. You sould create a copy of this called `production.json` and launch the app with the environment variable `NODE_ENV=production`.

- `app-name`: The name of your app, example MyRCONManager.

- `session`: Session data for remembering the server that was enterd

  - `name`: Name of the session, can be anything.
  - `secret`: Random unguessable string of characters.
  - `max-age`: How long the server will stay recognised with the browser.

- `maps`: An array of the maps you want. Stored as objects.

  - `realname`: The actual name of the map.
  - `mapfile`: The ingame file of the map. An image file called `<mapfile>.jpg` should also be placed in /public/images.
  - `gamemode`: The map game mode, i.e de, pl.
  - `config`: A config that can be executed after map load.
  
- `configs`: An array of server configs. Stored as objects.

  - `name`: Config name.
  - `config`: The actual config name
  - `description`: A short description of what the config does.
  
- `common-commands`: Some useful commands to execute with a single click
  
  - `name`: Command name.
  - `command`: The command itself.
  
## Bugs/Questions
Contact the developer on [Steam](http://steamcommunity.com/id/Thermo-Nuclear/) or [Discord](https://discord.gg/32mvNrr) (Thermite#5512).
