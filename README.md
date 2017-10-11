# AdminRCON
A simple webapp for executing commands on a Source gameserver. Made mainly for TF2 but is configurable for all Source games.

## Goals
- Simple usage
- Simple configuration

## TFRCON
TFRCON is the main implementation of AdminRCON. It conains popular Team Fortress 2 maps and competitive configs. To see AdminRCON in action see [tfrcon.net](http://103.73.64.197).

## Requirements
Nodejs and npm, preferably the latest version (8.6 or greater).

## Usage
View [help](http://103.73.64.197/help) for help with using the app.

## Configuration
The main configuration is located in `/config/default.json`. You sould create a copy of this called `production.json` and launch the app with the environment variable `NODE_ENV=production`.

- `app-name`: The name of your app, exapmple MyRCONManager.

- `session`: Session data for remembering the server that was enterd

  - `name`: Name of the session, can be anything.
  - `secret`: Random unguessable string of characters.
  - `max-age`: How long the server will stay recognised with the browser.

- `maps`: An array of the maps you want. Stored as objects.

  - `realname`: The actual name of the map.
  - `mapfile`: The ingame file of the map. An image file called `<mapfile>.jpg` should also be placed in /public/images.
  - `gamemode`: Optional. The map game mode, i.e de, pl.
  - `config`: Optional. A config that can be executed after map load.
  
- `configs`: An array of server configs. Stored as objects.

  - `name`: Config name.
  - `config`: The actual config name
  - `description`: A short description of what the config does.
  
- `common-commands`: Some useful commands to execute with a single click
  
  - `name`: Command name.
  - `command`: The command itself
