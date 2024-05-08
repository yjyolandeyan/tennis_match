const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/author/:type", routes.author);
app.get("/player_card_men/:first_name/:last_name", routes.player_card_man);
app.get("/player_card_women/:first_name/:last_name", routes.player_card_woman);

app.get("/top_player_men/:count", routes.top_player_men);
app.get("/top_player_women/:count", routes.top_player_women);

app.get(
  "/top_ranked_players/:count?/:country?/:date?",
  routes.top_ranked_players
);
app.get("/player_ranking_years/:year1?/:year2?", routes.player_ranking_years);

app.get("/players_with_most_losses/:count?", routes.players_with_most_losses);
app.get("/players_improve/:player_id/:year1?/:year2?", routes.players_improve);
app.get("/unstable_player/:count?", routes.unstable_player);
app.get("/best_surface/:surface?", routes.best_surface);

//player card page
app.get("/winning_stat_women/:player1/:player2", routes.winning_stat_women);
app.get("/winning_stat_men/:player1/:player2", routes.winning_stat_men);

app.get("/all_player_card_man", routes.all_player_card_man);
app.get("/all_player_card_woman", routes.all_player_card_woman);

// app.get("/winning_stat_test/:player1/:player2", routes.winning_stat_test);
app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
