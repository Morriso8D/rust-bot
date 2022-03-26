# Rust Discord Kits

## Table of Contents
    * [About](#about)
    * [Features](#features)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)

## About
    Rust Kit Manager is a discord bot which lets you (the server admin) create/manage kits for players to redeem via discord with slash-commands.

## Features
    * Redeem and customise kits with slash-commands
    * Kit timeouts (restrict how often a kit can be redeemed)
    * Guard admin commands behind a role
    * Log kit usage
    * Display players online in realtime (optional)
    * Extra in-game commands, such as: !online and !wipe (optional)
    * Send RCON commands via CLI (optional)

## Prerequisites
    * Docker/Docker Compose installed (https://docs.docker.com/compose/install/)
    * Discord bot token with full admin permissions and slash-commands enabled (https://discordpy.readthedocs.io/en/stable/discord.html)
    * Discord bot invited to the guild

## Installation
    1. Clone the repo ``git clone https://github.com/Morriso8D/rust-bot.git``
    2. Navigate to the project's root ``cd rust-bot``
    3. Rename the [example.env](./example.env) to '.env' ``mv example.env .env``
    4. Open the '.env' file and enter your server's rcon details and discord bot token ``vim .env``
    5. Rename [example.config.json](./src/example.config.json) to 'config.json' ''cd src && mv example.config.json config.json``
    6. Open 'config.json' and configure the bots setup ``vim config.json``
    7. Navigate to the project's root and build the docker image ``cd ../ && docker build .`` (this may take a few minutes)
    8. Start the bot ``docker-compose -d up``
