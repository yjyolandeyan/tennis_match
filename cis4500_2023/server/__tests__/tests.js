const { expect } = require("@jest/globals");
const supertest = require("supertest");
const app = require("../server");

// Route 0 test: get auther
describe("GET /author/:type", () => {
  test('responds with names when type is "name"', async () => {
    const response = await supertest(app).get("/author/name");
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(
      /Created by Julianna Cimillo, May Hathaway, Tianyi Wu, Yola Yan/
    );
  });

  test('responds with group number when type is "group_num"', async () => {
    const response = await supertest(app).get("/author/group_num");
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/Created by Group 7/);
  });

  test("responds with an error for invalid type", async () => {
    const response = await supertest(app).get("/author/invalid_type");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch(
      /'invalid_type' is not a valid author type. Valid types are 'name' and 'group_num'/
    );
  });
});

// Route 1 test: player_card_men
test("GET /player_card_men with valid name returns player data", async () => {
  const response = await supertest(app).get("/player_card_men/Rudy/Hernando");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      id: 100036,
      first_name: "Rudy",
      last_name: "Hernando",
      hand: "R",
      birthday: 19390610,
      country: "USA",
      gender: 0,
    },
  ]);
});

test("GET /all_player_card_man returns the first three player cards for men", async () => {
  const response = await supertest(app).get("/all_player_card_man");

  expect(response.statusCode).toBe(200);
  // Checking only the first three player cards
  expect(response.body.slice(0, 3)).toEqual([
    {
      id: 100036,
      first_name: "Rudy",
      last_name: "Hernando",
      hand: "R",
      birthday: 19390610,
      country: "USA",
      gender: 0,
    },
    {
      id: 100041,
      first_name: "Ned",
      last_name: "Neely",
      hand: "R",
      birthday: 19400114,
      country: "USA",
      gender: 0,
    },
    {
      id: 100042,
      first_name: "Ryoichi",
      last_name: "Mori",
      hand: "R",
      birthday: 19400114,
      country: "JPN",
      gender: 0,
    },
  ]);
}, 15000);

test("GET /player_card_men with valid name returns data for Jose Edison Mandarino", async () => {
  const response = await supertest(app).get(
    "/player_card_men/Jose Edison/Mandarino"
  );
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      id: 100054,
      first_name: "Jose Edison",
      last_name: "Mandarino",
      hand: "R",
      birthday: 19410326,
      country: "BRA",
      gender: 0,
    },
  ]);
});

test("GET /player_card_men with non-existent name returns empty object", async () => {
  const response = await supertest(app).get("/player_card_men/John/Doe");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({});
});

test("GET /player_card_men with errors", async () => {
  const response = await supertest(app).get("/player_card_men/Invalid/Name");
  expect(response.statusCode).toBe(200);
});

test("GET /all_player_card_man", async () => {
  const response = await supertest(app).get(`/all_player_card_man`);
  expect(response.statusCode).toBe(200);
  // Slicing the response body to check only the first 3 elements
  const fivePlayers = response.body.slice(0, 5);
  expect(fivePlayers).toEqual([
    {
      id: 100036,
      first_name: "Rudy",
      last_name: "Hernando",
      hand: "R",
      birthday: 19390610,
      country: "USA",
      gender: 0,
    },
    {
      id: 100041,
      first_name: "Ned",
      last_name: "Neely",
      hand: "R",
      birthday: 19400114,
      country: "USA",
      gender: 0,
    },
    {
      id: 100042,
      first_name: "Ryoichi",
      last_name: "Mori",
      hand: "R",
      birthday: 19400114,
      country: "JPN",
      gender: 0,
    },
    {
      id: 100043,
      first_name: "Zdenek",
      last_name: "Slizek",
      hand: "R",
      birthday: 19400219,
      country: "CZE",
      gender: 0,
    },
    {
      id: 100046,
      first_name: "Larry",
      last_name: "Nagler",
      hand: "R",
      birthday: 19400701,
      country: "USA",
      gender: 0,
    },
  ]);
});

// Route 1 test: player_card_women
test("GET /all_player_card_woman returns the first three player cards for women", async () => {
  const response = await supertest(app).get("/all_player_card_woman");

  expect(response.statusCode).toBe(200);
  // Checking only the first three player cards
  expect(response.body.slice(0, 3)).toEqual([
    {
      id: 200000,
      first_name: "X",
      last_name: "X",
      hand: "U",
      birthday: 19000000,
      country: "UNK",
      gender: 1,
    },
    {
      id: 200102,
      first_name: "Melissa",
      last_name: "Dowse",
      hand: "R",
      birthday: 19820427,
      country: "AUS",
      gender: 1,
    },
    {
      id: 200126,
      first_name: "Marissa",
      last_name: "Irvin",
      hand: "R",
      birthday: 19800623,
      country: "USA",
      gender: 1,
    },
  ]);
}, 15000);

test("GET /player_card_women with valid name returns player data", async () => {
  const response = await supertest(app).get("/player_card_women/Chris/Oneil");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      id: 200256,
      first_name: "Chris",
      last_name: "Oneil",
      hand: "R",
      birthday: 19560319,
      country: "AUS",
      gender: 1,
    },
  ]);
});

test("GET /player_card_women handles errors gracefully", async () => {
  const response = await supertest(app).get("/player_card_women/Invalid/Name");
  expect(response.statusCode).toBe(200);
});

test("GET /player_card_women with non-existent name returns empty object", async () => {
  const response = await supertest(app).get("/player_card_women/Mary/Yeing");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({});
});

// Route 2 test: /top_player_women/:count
test("GET /top_player_women with valid count returns top players data", async () => {
  const count = 5; // Assuming you want to test for the top 5 players
  const response = await supertest(app).get(`/top_player_women/${count}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 200293,
      player_name: "Martina Navratilova",
      matches_played: 1726,
    },
    { player_id: 200259, player_name: "Chris Evert", matches_played: 1502 },
    { player_id: 200237, player_name: "Virginia Wade", matches_played: 1293 },
    { player_id: 200748, player_name: "Venus Williams", matches_played: 1090 },
    {
      player_id: 200017,
      player_name: "Arantxa Sanchez Vicario",
      matches_played: 1066,
    },
  ]);
});

test("GET /top_player_women with non-integer count returns an error", async () => {
  const nonIntegerCount = "abc"; // A non-integer value
  const response = await supertest(app).get(
    `/top_player_women/${nonIntegerCount}`
  );
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    error: "Invalid input: 'count' must be a non-negative integer",
  });
});

test("GET /top_player_women not found", async () => {
  const nonIntegerCount = 0;
  const response = await supertest(app).get(
    `/top_player_women/${nonIntegerCount}`
  );
  expect(response.statusCode).toBe(404);
});

test("GET /top_player_women handles errors", async () => {
  const response = await supertest(app).get("/top_player_women/error");
  expect(response.statusCode).toBe(400);
});

// Route 2 test: /top_player_men/:count
test("GET /top_player_men with valid count returns top players data", async () => {
  const count = 10;
  const response = await supertest(app).get(`/top_player_men/${count}`);
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    { player_id: 100284, player_name: "Jimmy Connors", matches_played: 1581 },
    { player_id: 103819, player_name: "Roger Federer", matches_played: 1545 },
    { player_id: 100656, player_name: "Ivan Lendl", matches_played: 1317 },
    { player_id: 104745, player_name: "Rafael Nadal", matches_played: 1306 },
    { player_id: 104925, player_name: "Novak Djokovic", matches_played: 1302 },
    { player_id: 100119, player_name: "Ilie Nastase", matches_played: 1285 },
    { player_id: 100282, player_name: "Guillermo Vilas", matches_played: 1243 },
    { player_id: 101736, player_name: "Andre Agassi", matches_played: 1147 },
    { player_id: 100126, player_name: "Stan Smith", matches_played: 1133 },
    { player_id: 103970, player_name: "David Ferrer", matches_played: 1119 },
  ]);
});

test("GET /top_player_men with non-integer count returns an error", async () => {
  const nonIntegerCount = "abc"; // A non-integer value
  const response = await supertest(app).get(
    `/top_player_men/${nonIntegerCount}`
  );
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    error: "Invalid input: 'count' must be a non-negative integer",
  });
});

test("GET /top_player_men handles errors", async () => {
  const response = await supertest(app).get("/top_player_men/error");
  expect(response.statusCode).toBe(400);
});

test("GET /top_player_men not found", async () => {
  const nonIntegerCount = 0;
  const response = await supertest(app).get(
    `/top_player_men/${nonIntegerCount}`
  );
  expect(response.statusCode).toBe(404);
});

// Route 3 test: /players_with_most_losses/:num_players
test("GET /players_with_most_losses with valid count returns players data", async () => {
  const numberOfPlayers = 5;
  const response = await supertest(app).get(
    `/players_with_most_losses/${numberOfPlayers}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 200390,
      first_name: "Mary Lou",
      last_name: "Piatek",
      total_losses: 208,
    },
    {
      player_id: 100474,
      first_name: "Chris",
      last_name: "Lewis",
      total_losses: 196,
    },
    {
      player_id: 200402,
      first_name: "Wendy",
      last_name: "White",
      total_losses: 191,
    },
    {
      player_id: 109771,
      first_name: "Jairo",
      last_name: "Velasco",
      total_losses: 184,
    },
    {
      player_id: 100905,
      first_name: "Sammy",
      last_name: "Giammalva Jr",
      total_losses: 166,
    },
  ]);
}, 60000);

test("GET /players_with_most_losses with valid count returns players data no cache", async () => {
  const numberOfPlayers = 3;
  const response = await supertest(app).get(
    `/players_with_most_losses/${numberOfPlayers}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 200390,
      first_name: "Mary Lou",
      last_name: "Piatek",
      total_losses: 208,
    },
    {
      player_id: 100474,
      first_name: "Chris",
      last_name: "Lewis",
      total_losses: 196,
    },
    {
      player_id: 200402,
      first_name: "Wendy",
      last_name: "White",
      total_losses: 191,
    },
  ]);
}, 60000);

test("GET /players_with_most_losses with invalid count returns an error", async () => {
  const invalidCount = "abc";
  const response = await supertest(app).get(
    `/players_with_most_losses/${invalidCount}`
  );
  expect(response.statusCode).toBe(400);
  expect(response.text).toBe("Invalid number of players requested");
});

test("GET /players_with_most_losses handles errors", async () => {
  // Simulate an error condition here if possible
  const response = await supertest(app).get("/players_with_most_losses/error");
  expect(response.statusCode).toBe(400);
});

test("GET /players_with_most_losses not found", async () => {
  const zeroCount = 0;
  const response = await supertest(app).get(
    `/players_with_most_losses/${zeroCount}`
  );
  expect(response.statusCode).toBe(404);
});

// Route 4 test: /top_ranked_players/:count/:country/:date
test("GET /top_ranked_players/:count/:country/:date responds with top ranked players data", async () => {
  const numberOfPlayers = 5;
  const country = "USA";
  const date = "20000101";
  const response = await supertest(app).get(
    `/top_ranked_players/${numberOfPlayers}/${country}/${date}`
  );
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 200020,
      first_name: "Morgan",
      last_name: "Dill",
      gender: "M",
      player_rank: 28,
      ranking_points: 960,
    },
    {
      player_id: 200098,
      first_name: "Howard Murphy",
      last_name: "Payne",
      gender: "M",
      player_rank: 32,
      ranking_points: 826,
    },
    {
      player_id: 200040,
      first_name: "Keanu",
      last_name: "Ellen",
      gender: "M",
      player_rank: 47,
      ranking_points: 644,
    },
    {
      player_id: 200107,
      first_name: "Noah",
      last_name: "Makarome",
      gender: "M",
      player_rank: 72,
      ranking_points: 421,
    },
    {
      player_id: 200053,
      first_name: "Jeremiah",
      last_name: "Gonzalez",
      gender: "M",
      player_rank: 73,
      ranking_points: 416,
    },
  ]);
}, 60000);

test("GET /top_ranked_players/:count/:country/:date with invalid parameters returns an error", async () => {
  const numberOfPlayers = "invalid";
  const country = "USA";
  const date = "invalid-date";
  const response = await supertest(app).get(
    `/top_ranked_players/${numberOfPlayers}/${country}/${date}`
  );
  expect(response.statusCode).toBe(500);
});

test("GET /top_ranked_players/:count/:country/:date not found", async () => {
  const numberOfPlayers = "1";
  const country = "USA";
  const date = "20240101";
  const response = await supertest(app).get(
    `/top_ranked_players/${numberOfPlayers}/${country}/${date}`
  );
  expect(response.statusCode).toBe(404);
}, 15000);

// Route 5 test: /player_ranking_years/:year1/:year
test("GET /player_ranking_years/:year1/:year2 returns top 10 players based on average ranking", async () => {
  const year1 = "20000101";
  const year2 = "20050101";
  const response = await supertest(app).get(
    `/player_ranking_years/${year1}/${year2}`
  );
  expect(response.statusCode).toBe(200);

  // Slicing the response body to check only the first 10 elements
  const topTenPlayers = response.body.slice(0, 10);
  expect(topTenPlayers).toEqual([
    {
      player_id: 200126,
      player_name: "Marissa Irvin",
      avg_player_rank: 89.6617,
      country_id: "USA",
    },
    {
      player_id: 201938,
      player_name: "Ainhoa Goni Blanco",
      avg_player_rank: 226.5487,
      country_id: "ESP",
    },
    {
      player_id: 201312,
      player_name: "Sarah Taylor",
      avg_player_rank: 228.8415,
      country_id: "USA",
    },
    {
      player_id: 201464,
      player_name: "Nathalie Vierin",
      avg_player_rank: 233.906,
      country_id: "ITA",
    },
    {
      player_id: 202259,
      player_name: "Valentina Sassi",
      avg_player_rank: 261.1165,
      country_id: "ITA",
    },
    {
      player_id: 201314,
      player_name: "Nina Duebbers",
      avg_player_rank: 262.9474,
      country_id: "GER",
    },
    {
      player_id: 202085,
      player_name: "Galina Fokina",
      avg_player_rank: 264.3158,
      country_id: "RUS",
    },
    {
      player_id: 102167,
      player_name: "Juan Albert Viloca Puig",
      avg_player_rank: 267.8885,
      country_id: "ESP",
    },
    {
      player_id: 213471,
      player_name: "Anousjka Van Exel",
      avg_player_rank: 268.9286,
      country_id: "NED",
    },
    {
      player_id: 202152,
      player_name: "Jana Hlavackova",
      avg_player_rank: 274.4962,
      country_id: "CZE",
    },
  ]);
}, 20000);

test("GET /player_ranking_years/:year1/:year2 with invalid parameters returns an error", async () => {
  const invalidYear1 = "invalid-date";
  const invalidYear2 = "invalid-date";
  const response = await supertest(app).get(
    `/player_ranking_years/${invalidYear1}/${invalidYear2}`
  );
  expect(response.statusCode).toBe(500);
});

test("GET /player_ranking_years/:year1/:year2 with nonexistent parameters returns not found", async () => {
  const invalidYear1 = 1;
  const invalidYear2 = 2;
  const response = await supertest(app).get(
    `/player_ranking_years/${invalidYear1}/${invalidYear2}`
  );
  expect(response.statusCode).toBe(404);
}, 15000);

// Route 6 test: /player_improves/:player_id/:year1/:year2
test("GET /players_improve/:player_id/:year1/:year2 returns improvement data for the player", async () => {
  const player_id = "200001";
  const year1 = "1994";
  const year2 = "1997";
  const response = await supertest(app).get(
    `/players_improve/${player_id}/${year1}/${year2}`
  );

  expect(response.statusCode).toBe(200);
  // Check only the first element of the response array
  expect(response.body[0]).toEqual({ start_year_rank: 87, end_year_rank: 6 });
}, 60000);

test("GET /players_improve/:player_id/:year1/:year2 returns improvement data for the player no cache", async () => {
  const player_id = "101863";
  const year1 = "2000";
  const year2 = "2001";
  const response = await supertest(app).get(
    `/players_improve/${player_id}/${year1}/${year2}`
  );

  expect(response.statusCode).toBe(200);
  // Check only the first element of the response array
  expect(response.body[0]).toEqual({
    start_year_rank: 718,
    end_year_rank: 718,
  });
}, 60000);

test("GET /players_improve/:player_id/:year1/:year2 with nonexistent parameters returns not found", async () => {
  const invalidPlayerId = 1;
  const invalidYear1 = "2000";
  const invalidYear2 = "2002";
  const response = await supertest(app).get(
    `/player_improve/${invalidPlayerId}/${invalidYear1}/${invalidYear2}`
  );
  expect(response.statusCode).toBe(404);
});

// Route 7 test: /unstable_player/:count
test("GET /unstable_player/:count returns players with their wins and losses", async () => {
  const numPlayers = 5;
  const response = await supertest(app).get(`/unstable_player/${numPlayers}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    { first_name: "Daniel", last_name: "Krashin", wins: 1489, losses: 237 },
    { first_name: "Ugo", last_name: "Blanchet", wins: 1339, losses: 163 },
    { first_name: "Lourenzo", last_name: "Gasperini", wins: 932, losses: 361 },
    { first_name: "Kasper", last_name: "Elsvad", wins: 901, losses: 112 },
    { first_name: "Kushaan", last_name: "Nath", wins: 853, losses: 172 },
  ]);
}, 15000);

test("GET /unstable_player/:count with invalid parameters returns an error", async () => {
  const invalidCount = "invalid"; // Non-numeric value for count
  const response = await supertest(app).get(`/unstable_player/${invalidCount}`);
  expect(response.statusCode).toBe(400);
}, 15000);

// Route 8 test: /best_surface/:surface
test("GET /best_surface/:surface returns top five players for the specified surface", async () => {
  const surface = "Hard";
  const response = await supertest(app).get(`/best_surface/${surface}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.slice(0, 5)).toEqual([
    {
      player_id: 206902,
      first_name: "Yamile",
      last_name: "Cordova",
      best_surface: "Hard",
      total_matches: 9,
      total_wins: 9,
      win_rate: 100,
    },
    {
      player_id: 110949,
      first_name: "Meir",
      last_name: "Wertheimer",
      best_surface: "Hard",
      total_matches: 6,
      total_wins: 6,
      win_rate: 100,
    },
    {
      player_id: 215787,
      first_name: "Florencia",
      last_name: "Rossi",
      best_surface: "Hard",
      total_matches: 6,
      total_wins: 6,
      win_rate: 100,
    },
    {
      player_id: 204169,
      first_name: "Luiza",
      last_name: "Biktyakova",
      best_surface: "Hard",
      total_matches: 5,
      total_wins: 5,
      win_rate: 100,
    },
    {
      player_id: 206891,
      first_name: "Sandra",
      last_name: "Olsen",
      best_surface: "Hard",
      total_matches: 4,
      total_wins: 4,
      win_rate: 100,
    },
  ]);
}, 600000);

test("GET /best_surface/:surface with invalid surface parameter returns an error", async () => {
  const invalidSurface = "InvalidSurface";
  const response = await supertest(app).get(`/best_surface/${invalidSurface}`);
  expect(response.statusCode).toBe(404);
}, 150000);

test("GET /best_surface/:surface returns top five players for the specified surface", async () => {
  const surface = "Hard";
  const response = await supertest(app).get(`/best_surface/${surface}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.slice(0, 5)).toEqual([
    {
      player_id: 206902,
      first_name: "Yamile",
      last_name: "Cordova",
      best_surface: "Hard",
      total_matches: 9,
      total_wins: 9,
      win_rate: 100,
    },
    {
      player_id: 110949,
      first_name: "Meir",
      last_name: "Wertheimer",
      best_surface: "Hard",
      total_matches: 6,
      total_wins: 6,
      win_rate: 100,
    },
    {
      player_id: 215787,
      first_name: "Florencia",
      last_name: "Rossi",
      best_surface: "Hard",
      total_matches: 6,
      total_wins: 6,
      win_rate: 100,
    },
    {
      player_id: 204169,
      first_name: "Luiza",
      last_name: "Biktyakova",
      best_surface: "Hard",
      total_matches: 5,
      total_wins: 5,
      win_rate: 100,
    },
    {
      player_id: 206891,
      first_name: "Sandra",
      last_name: "Olsen",
      best_surface: "Hard",
      total_matches: 4,
      total_wins: 4,
      win_rate: 100,
    },
  ]);
}, 600000);

// Route 9 test: /winning_stat_women/:player1/:player2
test("GET /winning_stat_women/:player1/:player2 returns winning statistics for two players", async () => {
  const player1 = 224048; // Player 1 ID
  const player2 = 200803; // Player 2 ID
  const response = await supertest(app).get(
    `/winning_stat_women/${player1}/${player2}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 224048,
      first_name: "Mabel",
      last_name: "Bove",
      wins: 0,
      losses: 1,
      total_matches: 1,
      win_percentage: 0.0,
    },
  ]);
}, 15000);

test("GET /winning_stat_women/:player1/:player2 with invalid parameters returns an error", async () => {
  const invalidPlayer1 = "invalid1";
  const invalidPlayer2 = "invalid2";
  const response = await supertest(app).get(
    `/winning_stat/${invalidPlayer1}/${invalidPlayer2}`
  );
  expect(response.statusCode).toBe(404);
});

test("GET /winning_stat_women/:player1/:player2 with nonexistent parameters returns not found", async () => {
  const invalidPlayer1 = 1;
  const invalidPlayer2 = 2;
  const response = await supertest(app).get(
    `/winning_stat_women/${invalidPlayer1}/${invalidPlayer2}`
  );
  expect(response.statusCode).toBe(404);
}, 15000);

// test: /winning_stat_men/:player1/:player2
test("GET /winning_stat_men/:player1/:player2 returns individual winning statistics for each player", async () => {
  const player1 = 100181; // Player 1 ID
  const player2 = 207686; // Player 2 ID
  const response = await supertest(app).get(
    `/winning_stat_men/${player1}/${player2}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 100181,
      first_name: "Larry",
      last_name: "Turville",
      wins: 6,
      losses: 16,
      total_matches: 22,
      win_percentage: 0.27,
    },
    {
      player_id: 207686,
      first_name: "Alexander",
      last_name: "Shevchenko",
      wins: 8,
      losses: 15,
      total_matches: 23,
      win_percentage: 0.35,
    },
  ]);
}, 15000);

// Route 9??? test: /winning_stat_test/:player1/:player2
test("GET /winning_stat_men/:player1/:player2 returns winning statistics for two players", async () => {
  const player1 = 100181; // Player 1 ID
  const player2 = 207686; // Player 2 ID
  const response = await supertest(app).get(
    `/winning_stat_men/${player1}/${player2}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([
    {
      player_id: 100181,
      first_name: "Larry",
      last_name: "Turville",
      wins: 6,
      losses: 16,
      total_matches: 22,
      win_percentage: 0.27,
    },
    {
      player_id: 207686,
      first_name: "Alexander",
      last_name: "Shevchenko",
      wins: 8,
      losses: 15,
      total_matches: 23,
      win_percentage: 0.35,
    },
  ]);
}, 15000);

test("GET /winning_stat_men/:player1/:player2 with invalid parameters returns an error", async () => {
  const invalidPlayer1 = "invalid1";
  const invalidPlayer2 = "invalid2";
  const response = await supertest(app).get(
    `/winning_stat_men/${invalidPlayer1}/${invalidPlayer2}`
  );
  expect(response.statusCode).toBe(500);
});

test("GET /winning_stat_men/:player1/:player2 with nonexistent parameters returns not found", async () => {
  const invalidPlayer1 = 1;
  const invalidPlayer2 = 2;
  const response = await supertest(app).get(
    `/winning_stat_men/${invalidPlayer1}/${invalidPlayer2}`
  );
  expect(response.statusCode).toBe(404);
});
