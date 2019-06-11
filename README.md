# party-playoff-bot
Discord (and others?) bot to host a game of Party Playoff

## Done
- wrote beginnings of discord server code
- created a test console server
- interface for servers
- created data layer
- init game (and random picks for initial brackets)
- welcome new user to game via !join
- process each individual pick via !pick #
- prompt for next step of join
- handle re-joins
- command to reset game

## TODO
- handle game start
- process votes from users (and revotes)
- handle round end, next round start (via command)
-- send message to users when their picks are involved
- handle game end scoring

## Future
- use a data store other than local disk
- persist player scores across games
- betting on other players' picks
