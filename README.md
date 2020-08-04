node-snake-game
========

This project is a snake game using WebSockets, allowing 2 players to play together.
 
# Table of Contents
* [Overview](#overview)
* [Current Features](#current-features)
* [Browser Support](#browser-support)
* [Project Demo](#project-demo)
* [Todo](#todo)
* [Known Issues](#known-issues)
* [Built With](#built-with)
* [Author](#author)
* [License](#license)
 
# Overview


# Current Features
* 
 
# Browser Support
All current browsers are fully supported.
* Chrome 83
* Firefox 76
* Edge 83
* Safari 13.1
* Opera 68
 
# Project Demo
A live demo of the project can be found at [this address](https://node-snake-game.herokuapp.com/).
 
# Todo
- add smartphone controls to play
- add favicon
- use cache to keep trace of scores
- generate canvas color scheme on page load
 
# Known Issues
- in multiplayer game, if one of the players have internet issues, snakes positions could possibly be different in both clients ; it comes from the fact that server send to clients ***directions*** and not ***positions***. It might be done in an upcoming version.
- Multiple hits on the "restart" button increases the framerate, then gets back to normal after game over.
- canvas visual proportions are document-size dependent (it can currently shrink because of right side buttons)
 
# Built With
* [Node.js](http://nodejs.org/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)
 
# Author
* **Corentin Boulanouar** - [Shawnuke](https://github.com/Shawnuke)

# Forked from
* [jamesward/hello-node_js-express](https:/github.com/jamesward/hello-node_js-express)
 
# License
[MIT](LICENSE) © Corentin Boulanouar
 
This project is licensed under the terms of the [MIT](LICENSE) license.<br>
See the [LICENSE.md]() file for more information.
