const mysql = require("mysql");
const config = require("./config.json");
const redis = require("redis");

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect((err) => err && console.log(err));

//Redis connection
const redisClient = redis.createClient({
  url: `rediss://default:95e00f8aac0247d9bfcce2d0010a7767@us1-stable-sunbeam-41683.upstash.io:41683`,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

const author = async function (req, res) {
  const name = "Julianna Cimillo, May Hathaway, Tianyi Wu, Yola Yan";
  const group_num = "7";

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === "name") {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === "group_num") {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by Group ${group_num}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res
      .status(400)
      .send(
        `'${req.params.type}' is not a valid author type. Valid types are 'name' and 'group_num'.`
      );
  }
};

// Route 1: Get /player_card_men/:first_name/:last_name
// Work
const player_card_man = async function (req, res) {
  connection.query(
    `
    SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
    FROM Player_Men
    WHERE first_name = '${req.params.first_name}' AND last_name = '${req.params.last_name}'
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const all_player_card_man = async function (req, res) {
  connection.query(
    `
    SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
    FROM Player_Men 
    WHERE birth_date IS NOT NULL
    ORDER BY player_id
    LIMIT 200
    `,
    (err, data) => {
      if (err || data.length === 0) {
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const all_player_card_woman = async function (req, res) {
  connection.query(
    `
    SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
    FROM Player_Women
    WHERE birth_date IS NOT NULL
    ORDER BY player_id
    LIMIT 200
    `,
    (err, data) => {
      if (err || data.length === 0) {
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 1: Get /player_card_women/:first_name/:last_name
// Work
const player_card_woman = async function (req, res) {
  connection.query(
    `
    SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
    FROM Player_Women
    WHERE first_name = '${req.params.first_name}' AND last_name = '${req.params.last_name}'
    `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 2: Get /top_player_women/:count
// Work
//Cache
const top_player_women = async function (req, res) {
  const count = req.params.count ? parseInt(req.params.count, 10) : 5; // Number of players, with a default of 5
  if (isNaN(count) || count < 0) {
    res
      .status(400)
      .json({ error: "Invalid input: 'count' must be a non-negative integer" });
    return;
  }

  // Create a unique cache key by including the count parameter
  const cacheKey = `top_player_women_${count}`;

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, parse it and send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
        SELECT player_id, player_name, COUNT(*) AS matches_played
        FROM (
           SELECT winner_id AS player_id, winner_name AS player_name
           FROM Tournament_Women
           UNION ALL
           SELECT loser_id AS player_id, loser_name AS player_name
           FROM Tournament_Women
        ) AS players
        GROUP BY player_id, player_name
        ORDER BY matches_played DESC
        LIMIT ${count};
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          if (data.length === 0) {
            res.status(404).json({ error: "No data found" });
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

// Route 2: Get /top_player_men/:count
// Work
//Cache
const top_player_men = async function (req, res) {
  const count = req.params.count ? parseInt(req.params.count, 10) : 5; // Default to 5 if count isn't provided
  if (isNaN(count) || count < 0) {
    res
      .status(400)
      .json({ error: "Invalid input: 'count' must be a non-negative integer" });
    return;
  }

  // Create a cache key that includes the count of top players
  const cacheKey = `top_player_men_${count}`;

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
        SELECT player_id, player_name, COUNT(*) AS matches_played
        FROM (
           SELECT winner_id AS player_id, winner_name AS player_name
           FROM Tournament_Men
           UNION ALL
           SELECT loser_id AS player_id, loser_name AS player_name
           FROM Tournament_Men
        ) AS players
        GROUP BY player_id, player_name
        ORDER BY matches_played DESC
        LIMIT ${count};
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          if (data.length === 0) {
            res.status(404).json({ error: "No data found" });
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

// Route 3 : /players_with_most_losses/:numberOfPlayers
// Work
const players_with_most_losses = async function (req, res) {
  const numberOfPlayers = req.params.count ? req.params.count : 5; // Default to 5 if no specific count is provided

  // Validate count to ensure it's a non-negative integer
  if (isNaN(numberOfPlayers) || numberOfPlayers < 0) {
    res.status(400).send("Invalid number of players requested");
    return;
  }

  // Create a unique cache key by including the number of players
  const cacheKey = `players_with_most_losses_${numberOfPlayers}`;

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
        SELECT player_id, first_name, last_name, COUNT(loser_id) AS total_losses
        FROM (
          SELECT player_id, first_name, last_name, loser_id
          FROM Player_Men pm
          JOIN Tournament_Men tm ON pm.player_id = tm.loser_id
          UNION ALL
          SELECT player_id, first_name, last_name, loser_id
          FROM Player_Women pw
          JOIN Tournament_Women tw ON pw.player_id = tw.loser_id
        ) AS combined
        GROUP BY player_id, first_name, last_name
        ORDER BY total_losses DESC
        LIMIT ${numberOfPlayers}
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).send("Error executing the query");
        } else {
          if (data.length === 0) {
            res.status(404).send("No data found");
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle potential Redis errors
    res.status(500).send("Error fetching data from cache");
  }
};

// Route 4. /top_ranked_players/:count/:country/:date
// Cached:
const top_ranked_players = async function (req, res) {
  const numberOfPlayers = req.params.count ? req.params.count : 5; // Number of players
  const country = req.params.country ? req.params.country : "USA"; // Country code, e.g., 'USA'
  const date = req.params.date ? req.params.date : 20191230; // Date in YYYYMMDD format, e.g., 20000101
  const cacheKey = `top_ranked_players_${country}_${date}_${numberOfPlayers}`; // Create a unique cache key

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      connection.query(
        `
        SELECT
          p.player_id,
          p.first_name,
          p.last_name,
          p.gender,
          cr.player_rank,
          cr.ranking_points
        FROM
          (SELECT player_id, first_name, last_name, country_id, 'M' AS gender FROM Player_Men
          UNION ALL
          SELECT player_id, first_name, last_name, country_id, 'W' AS gender FROM Player_Women) AS p
        JOIN
          (SELECT
              player_id,
              ranking_date,
              player_rank,
              ranking_points,
              CASE
                  WHEN SUBSTRING(ranking_date, 1, 4) = '2000' THEN 'Men_00'
                  WHEN SUBSTRING(ranking_date, 1, 4) = '2020' THEN 'Men_20'
                  WHEN SUBSTRING(ranking_date, 1, 4) = '2000' THEN 'Women_00'
                  WHEN SUBSTRING(ranking_date, 1, 4) = '2020' THEN 'Women_20'
              END AS ranking_type
          FROM
              Ranking_Men_00
          UNION ALL
          SELECT
              player_id,
              ranking_date,
              player_rank,
              ranking_points,
              'Men_20' AS ranking_type
          FROM
              Ranking_Men_20
          UNION ALL
          SELECT
              player_id,
              ranking_date,
              player_rank,
              ranking_points,
              'Women_00' AS ranking_type
          FROM
              Ranking_Women_00
          UNION ALL
          SELECT
              player_id,
              ranking_date,
              player_rank,
              ranking_points,
              'Women_20' AS ranking_type
          FROM
              Ranking_Women_20) AS cr
        ON p.player_id = cr.player_id
        WHERE
          cr.ranking_date = ${date} AND p.country_id = '${country}'
        ORDER BY
          cr.player_rank ASC
        LIMIT ${numberOfPlayers};
      `,
        async (err, data) => {
          if (err) {
            console.error("Database error:", err);
            res.status(500).json({ error: "Internal server error" });
          } else {
            if (data.length === 0) {
              res.status(404).json({ error: "No data found" });
            } else {
              // Save the fetched data to Redis cache
              await redisClient.set(cacheKey, JSON.stringify(data));
              res.json(data);
            }
          }
        }
      );
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

//Route 8. /unstable_player/:year1/:year2
//Work
//Cached
const unstable_player = async function (req, res) {
  const numPlayers = req.params.count ? req.params.count : 5; // Default to 5 if no specific count is provided

  // Validate count to ensure it's a non-negative integer
  if (isNaN(numPlayers) || numPlayers < 1) {
    res.status(400).send("Invalid number of players requested");
    return;
  }

  // Create a unique cache key by including the count of players
  const cacheKey = `unstable_player_${numPlayers}`;

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
        WITH player_wins AS (
            SELECT winner_id AS player_id, COUNT(*) AS win_count
            FROM Tournament_Men
            GROUP BY winner_id
            UNION ALL
            SELECT winner_id, COUNT(*)
            FROM Tournament_Women
            GROUP BY winner_id
        ),
        player_losses AS (
            SELECT loser_id AS player_id, COUNT(*) AS loss_count
            FROM Tournament_Men
            GROUP BY loser_id
            UNION ALL
            SELECT loser_id, COUNT(*)
            FROM Tournament_Women
            GROUP BY loser_id
        ),
        combined_wins_losses AS (
            SELECT player_id, SUM(win_count) AS wins
            FROM player_wins
            GROUP BY player_id
        ),
        combined_losses_wins AS (
            SELECT player_id, SUM(loss_count) AS losses
            FROM player_losses
            GROUP BY player_id
        ),
        combined_results AS (
            SELECT 
                p.player_id,
                COALESCE(cwl.wins, 0) AS wins,
                COALESCE(clw.losses, 0) AS losses
            FROM 
                (SELECT player_id FROM player_wins
                 UNION
                 SELECT player_id FROM player_losses) p
            LEFT JOIN combined_wins_losses cwl ON p.player_id = cwl.player_id
            LEFT JOIN combined_losses_wins clw ON p.player_id = clw.player_id
        )
        SELECT 
            COALESCE(pm.first_name, pw.first_name) AS first_name,
            COALESCE(pm.last_name, pw.last_name) AS last_name,
            cr.wins,
            cr.losses
        FROM combined_results cr
        LEFT JOIN Player_Men pm ON cr.player_id = pm.player_id
        LEFT JOIN Player_Women pw ON cr.player_id = pw.player_id
        WHERE pm.player_id IS NOT NULL OR pw.player_id IS NOT NULL
        ORDER BY cr.wins DESC, cr.losses DESC
        LIMIT ${numPlayers}
      `;

      connection.query(query, async (err, results) => {
        if (err) {
          console.error("Error executing the query", err);
          res.status(500).send("Error executing the query");
        } else {
          // Save the fetched data to Redis cache
          await redisClient.set(cacheKey, JSON.stringify(results));
          res.json(results);
        }
      });
    }
  } catch (error) {
    // Handle potential Redis errors
    console.error("Redis error:", error);
    res.status(500).send("Error fetching data from cache");
  }
};

//Route 6. /players_improve/:player_id/:year1/:year2
// Work
//Cached
const players_improve = async function (req, res) {
  const player_id = req.params.player_id;
  const year1 = req.params.year1 ? req.params.year1 : "20000101";
  const year2 = req.params.year2 ? req.params.year2 : "20050101";

  // Ensure valid input for player_id
  if (!player_id) {
    res.status(400).json({ error: "Invalid input: 'player_id' is required" });
    return;
  }

  // Create a unique cache key by including the player_id, year1, and year2
  const cacheKey = `players_improve_${player_id}_${year1}_${year2}`;

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, parse it and send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
        WITH combined_ranking AS (
          SELECT player_id, YEAR(ranking_date) AS year, player_rank
          FROM Ranking_Men_00
          WHERE player_id = ${player_id}
          UNION ALL
          SELECT player_id, YEAR(ranking_date) AS year, player_rank
          FROM Ranking_Men_20
          WHERE player_id = ${player_id}
          UNION ALL
          SELECT player_id, YEAR(ranking_date) AS year, player_rank
          FROM Ranking_Women_00
          WHERE player_id = ${player_id}
          UNION ALL
          SELECT player_id, YEAR(ranking_date) AS year, player_rank
          FROM Ranking_Women_20
          WHERE player_id = ${player_id}
        ),
        start_year AS (
          SELECT player_rank
          FROM combined_ranking
          WHERE year = ${year1}
        ),
        end_year AS (
          SELECT player_rank
          FROM combined_ranking
          WHERE year = ${year2}
        )
        SELECT sy.player_rank AS start_year_rank, ey.player_rank AS end_year_rank
        FROM start_year sy
        CROSS JOIN end_year ey;
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          if (data.length === 0) {
            res
              .status(404)
              .json({ error: "No data found for player_id " + player_id });
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

//Route 5./player_ranking_years/:year1/:year2
// Work
// Cached:
const player_ranking_years = async function (req, res) {
  const year1 = req.params.year1 ? req.params.year1 : 20000101;
  const year2 = req.params.year2 ? req.params.year2 : 20050101;
  const cacheKey = `player_ranking_years_${year1}_${year2}`; // Create a unique cache key

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
      SELECT player_id, player_name, country_id, AVG(player_rank) AS avg_player_rank
      FROM (
        SELECT rm.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, pm.country_id, rm.player_rank
        FROM Ranking_Men_00 rm
        JOIN Player_Men pm ON rm.player_id = pm.player_id
        WHERE rm.ranking_date >= ${year1} AND rm.ranking_date <= ${year2}

        UNION ALL

        SELECT rw.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, pw.country_id, rw.player_rank
        FROM Ranking_Women_00 rw
        JOIN Player_Women pw ON rw.player_id = pw.player_id
        WHERE rw.ranking_date >= ${year1} AND rw.ranking_date <= ${year2}

        UNION ALL

        SELECT rm20.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, pm.country_id, rm20.player_rank
        FROM Ranking_Men_20 rm20
        JOIN Player_Men pm ON rm20.player_id = pm.player_id
        WHERE rm20.ranking_date >= ${year1} AND rm20.ranking_date <= ${year2}

        UNION ALL

        SELECT rw20.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, pw.country_id, rw20.player_rank
        FROM Ranking_Women_20 rw20
        JOIN Player_Women pw ON rw20.player_id = pw.player_id
        WHERE rw20.ranking_date >= ${year1} AND rw20.ranking_date <= ${year2}
      ) AS combined_ranks
      GROUP BY player_id, player_name
      ORDER BY avg_player_rank ASC
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          if (data.length === 0) {
            res.status(404).json({ error: "No data found" });
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

//Route 7. /best_surface/:surface
// Work
// Cached:
const best_surface = async function (req, res) {
  const surface = req.params.surface ? req.params.surface : "Hard"; // Default surface if not provided
  const cacheKey = `best_surface_${surface}`; // Create a cache key that includes the surface

  try {
    // Check for cached data
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data is found in cache, send it in the response
      console.log("Cache hit, serving from Redis");
      res.json(JSON.parse(cachedData));
    } else {
      // If not in cache, perform the database query
      console.log("Cache miss, querying the database");
      const query = `
      WITH AllMatches AS (
        SELECT winner_id AS player_id, first_name, last_name,
               surface,
               1 AS is_winner
        FROM Tournament_Women
        JOIN Player_Women ON Tournament_Women.winner_id = Player_Women.player_id
        WHERE Tournament_Women.surface = '${surface}'
        UNION ALL
        SELECT winner_id AS player_id, first_name, last_name,
               surface,
               1 AS is_winner
        FROM Tournament_Men
        JOIN Player_Men ON Tournament_Men.winner_id = Player_Men.player_id
        WHERE Tournament_Men.surface = '${surface}'
        UNION ALL
        SELECT loser_id AS player_id, first_name, last_name,
               surface,
               0 AS is_winner
        FROM Tournament_Women
        JOIN Player_Women ON Tournament_Women.loser_id = Player_Women.player_id
        WHERE Tournament_Women.surface = '${surface}'
        UNION ALL
        SELECT loser_id AS player_id, first_name, last_name,
               surface,
               0 AS is_winner
        FROM Tournament_Men
        JOIN Player_Men ON Tournament_Men.loser_id = Player_Men.player_id
        WHERE Tournament_Men.surface = '${surface}'
      )
      SELECT player_id,
             first_name,
             last_name,
             surface AS best_surface,
             SUM(is_winner) AS total_wins,
             COUNT(*) AS total_matches,
             SUM(is_winner) * 100.0 / COUNT(*) AS win_rate
      FROM AllMatches
      GROUP BY player_id, first_name, last_name
      ORDER BY win_rate DESC, total_wins DESC
      LIMIT 200
      `;

      connection.query(query, async (err, data) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          if (data.length === 0) {
            res.status(404).json({ error: "No data found" });
          } else {
            // Save the fetched data to Redis cache
            await redisClient.set(cacheKey, JSON.stringify(data));
            res.json(data);
          }
        }
      });
    }
  } catch (error) {
    // Handle Redis errors
    res.status(500).json({ error: "Error fetching data from cache" });
  }
};

//Route 9. /winning_stat/:player1/:player
// Work
const winning_stat_women = async function (req, res) {
  const player1 = req.params.player1;
  const player2 = req.params.player2;

  const query = `
  SELECT
  player.player_id AS player_id,
  player.first_name AS first_name,
  player.last_name AS last_name,
  SUM(CASE WHEN t.winner_id = player.player_id THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN t.loser_id = player.player_id THEN 1 ELSE 0 END) AS losses,
  COUNT(*) AS total_matches,
  ROUND(SUM(CASE WHEN t.winner_id = player.player_id THEN 1 ELSE 0 END) / COUNT(*), 2) AS win_percentage
FROM
  (
    SELECT * FROM Tournament_Women
  ) AS t
JOIN
  (
    SELECT player_id, first_name, last_name, 'W' FROM Player_Women
  ) AS player ON t.winner_id = player.player_id OR t.loser_id = player.player_id
WHERE player.player_id = ${player1} OR player.player_id = ${player2}
GROUP BY player.player_id, player.first_name, player.last_name;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      res.status(500).send("Error retrieving match");
    } else {
      if (data.length === 0) {
        res.status(404).send("No data found");
      } else {
        res.json(data);
      }
    }
  });
};

const winning_stat_men = async function (req, res) {
  const player1 = req.params.player1;
  const player2 = req.params.player2;

  const query = `
  SELECT
  player.player_id AS player_id,
  player.first_name AS first_name,
  player.last_name AS last_name,
  SUM(CASE WHEN t.winner_id = player.player_id THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN t.loser_id = player.player_id THEN 1 ELSE 0 END) AS losses,
  COUNT(*) AS total_matches,
  ROUND(SUM(CASE WHEN t.winner_id = player.player_id THEN 1 ELSE 0 END) / COUNT(*), 2) AS win_percentage
FROM
  (
    SELECT * FROM Tournament_Men
  ) AS t
JOIN
  (
    SELECT player_id, first_name, last_name, 'W' FROM Player_Men
  ) AS player ON t.winner_id = player.player_id OR t.loser_id = player.player_id
WHERE player.player_id = ${player1} OR player.player_id = ${player2}
GROUP BY player.player_id, player.first_name, player.last_name;
  `;

  connection.query(query, (err, data) => {
    if (err) {
      res.status(500).send("Error retrieving match");
    } else {
      if (data.length === 0) {
        res.status(404).send("No data found");
      } else {
        res.json(data);
      }
    }
  });
};

module.exports = {
  author,
  player_card_man,
  player_card_woman,
  top_player_men,
  top_player_women,
  players_with_most_losses,
  top_ranked_players,
  unstable_player,
  players_improve,
  player_ranking_years,
  best_surface,
  winning_stat_men,
  winning_stat_women,
  all_player_card_man,
  all_player_card_woman,
};
