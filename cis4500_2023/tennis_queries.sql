## queries

## query 1
SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
FROM Player_Women;

## query 2
SELECT player_id AS id, first_name, last_name, hand, birth_date AS birthday, country_id AS country, gender
FROM Player_Men;

## query 3
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
LIMIT 5;

## query 4
SELECT player_id, first_name, last_name, COUNT(loser_id) AS total_losses
FROM (
SELECT player_id, first_name, last_name, loser_id
FROM Player_Men pm
JOIN Tournament_Men_Qual tmq ON pm.player_id = tmq.loser_id
UNION ALL
SELECT player_id, first_name, last_name, loser_id
   		FROM Player_Women pw
   		JOIN Tournament_Women_Qual twq ON pw.player_id = twq.loser_id
) AS combined
GROUP BY  player_id, first_name, last_name
ORDER BY total_losses DESC
LIMIT 1;

## query 5
SELECT pm.player_id, pm.first_name, pm.last_name, rm.player_rank, rm.ranking_points
FROM Player_Men pm
JOIN Ranking_Men_00 rm ON pm.player_id = rm.player_id
WHERE pm.country_id = 'USA'AND rm.ranking_date = 20050912
ORDER BY rm.player_rank
LIMIT 10;

## query 6
WITH start_year AS(
   SELECT player_rank
   FROM Ranking_Women_20
   WHERE player_id = 200001
     AND SUBSTRING(CAST(ranking_date AS CHAR), 1, 4) = 1994
   ORDER BY ranking_date DESC
   LIMIT 1),
last_year AS (
   SELECT player_rank
   FROM Ranking_Women_20
   WHERE player_id = 200001
     AND SUBSTRING(CAST(ranking_date AS CHAR), 1, 4) = 1997
   ORDER BY ranking_date DESC
   LIMIT 1
   )
SELECT *
FROM start_year FULL JOIN last_year;

## query 7
SELECT
  country_id,
  MAX(player_rank) AS highest_rank,
  MIN(player_rank) AS lowest_rank,
  AVG(player_rank) AS average_rank
FROM (
  SELECT
      pm.country_id,
      rm.player_rank
  FROM
      Player_Men pm
  JOIN
      Ranking_Men_00 rm ON pm.player_id = rm.player_id
  WHERE
      rm.ranking_date BETWEEN 20000101 AND 20101231
  UNION ALL
  SELECT
      pw.country_id,
      rw.player_rank
  FROM
      Player_Women pw
  JOIN
      Ranking_Women_00 rw ON pw.player_id = rw.player_id
  WHERE
      rw.ranking_date BETWEEN 20000101 AND 20010231
  UNION ALL
  SELECT
      pm.country_id,
      rm.player_rank
  FROM
      Player_Men pm
  JOIN
      Ranking_Men_20 rm ON pm.player_id = rm.player_id
  WHERE
      rm.ranking_date BETWEEN 20100101 AND 20101231
  UNION ALL
  SELECT
      pw.country_id,
      rw.player_rank
  FROM
      Player_Women pw
  JOIN
      Ranking_Women_20 rw ON pw.player_id = rw.player_id
  WHERE
      rw.ranking_date BETWEEN 20100101 AND 20101231
) AS combined_ranks
GROUP BY
  country_id
ORDER BY
  country_id;

## query 8

## unoptimized query
SELECT player_id, player_name, AVG(player_rank) AS average_ranking
FROM (
   SELECT rm.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, rm.player_rank
   FROM Ranking_Men_00 rm
   JOIN Player_Men pm ON rm.player_id = pm.player_id
   WHERE rm.ranking_date BETWEEN 20100101 AND 20101231
   UNION ALL
   SELECT rm.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, rm.player_rank
   FROM Ranking_Men_20 rm
   JOIN Player_Men pm ON rm.player_id = pm.player_id
   WHERE rm.ranking_date BETWEEN 20100101 AND 20101231
   UNION ALL
   SELECT rw.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, rw.player_rank
   FROM Ranking_Women_00 rw
   JOIN Player_Women pw ON rw.player_id = pw.player_id
   WHERE rw.ranking_date BETWEEN 20100101 AND 20101231
   UNION ALL
   SELECT rw.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, rw.player_rank
   FROM Ranking_Women_20 rw
   JOIN Player_Women pw ON rw.player_id = pw.player_id
   WHERE rw.ranking_date BETWEEN 20100101 AND 20101231
   UNION ALL
   SELECT rm.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, rm.player_rank
   FROM Ranking_Men_00 rm
   JOIN Player_Men pm ON rm.player_id = pm.player_id
) AS player_rankings
GROUP BY player_id, player_name
ORDER BY average_ranking;

## optimized query
SELECT player_id, player_name, AVG(player_rank) AS avg_player_rank
FROM (
   SELECT rm.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, rm.player_rank
   FROM Ranking_Men_00 rm
   JOIN Player_Men pm ON rm.player_id = pm.player_id
   WHERE rm.ranking_date >= start_of_year AND rm.ranking_date <= end_of_year
   UNION ALL
   SELECT rw.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, rw.player_rank
   FROM Ranking_Women_00 rw
   JOIN Player_Women pw ON rw.player_id = pw.player_id
   WHERE rw.ranking_date >= start_of_year AND rw.ranking_date <= end_of_year
   UNION ALL
   SELECT rm20.player_id, CONCAT(pm.first_name, ' ', pm.last_name) AS player_name, rm20.player_rank
   FROM Ranking_Men_20 rm20
   JOIN Player_Men pm ON rm20.player_id = pm.player_id
   WHERE rm20.ranking_date >= start_of_year AND rm20.ranking_date <= end_of_year
   UNION ALL
   SELECT rw20.player_id, CONCAT(pw.first_name, ' ', pw.last_name) AS player_name, rw20.player_rank
   FROM Ranking_Women_20 rw20
   JOIN Player_Women pw ON rw20.player_id = pw.player_id
   WHERE rw20.ranking_date >= start_of_year AND rw20.ranking_date <= end_of_year
) AS combined_ranks
GROUP BY player_id, player_name
ORDER BY avg_player_rank ASC

## query 9
WITH AllMatches AS (
   SELECT winner_id AS player_id,
          CONCAT(first_name, ' ', last_name) AS player_name,
          surface,
          1 AS is_winner
   FROM Tournament_Women
   JOIN Player_Women ON Tournament_Women.winner_id = Player_Women.player_id
   UNION ALL
   SELECT winner_id AS player_id,
          CONCAT(first_name, ' ', last_name) AS player_name,
          surface,
          1 AS is_winner
   FROM Tournament_Men
   JOIN Player_Men ON Tournament_Men.winner_id = Player_Men.player_id
   UNION ALL
   SELECT loser_id AS player_id,
          CONCAT(first_name, ' ', last_name) AS player_name,
          surface,
          0 AS is_winner
   FROM Tournament_Women
   JOIN Player_Women ON Tournament_Women.loser_id = Player_Women.player_id
   UNION ALL
   SELECT loser_id AS player_id,
          CONCAT(first_name, ' ', last_name) AS player_name,
          surface,
          0 AS is_winner
   FROM Tournament_Men
   JOIN Player_Men ON Tournament_Men.loser_id = Player_Men.player_id
)
SELECT player_id,
      player_name,
      surface AS best_surface,
      MAX(win_rate) AS max_win_rate
FROM (
   SELECT player_id,
          player_name,
          surface,
          SUM(is_winner) * 100.0 / COUNT(*) AS win_rate,
          ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY SUM(is_winner) * 100.0 / COUNT(*) DESC) AS rn
   FROM AllMatches
   GROUP BY player_id, player_name, surface
) AS player_surface_win_rates
WHERE win_rate > 0 and surface IS NOT NULL
GROUP BY player_id, player_name;


## query 10
SELECT
 p1.player_id AS player1_id,
 p1.first_name AS player1_first_name,
 p1.last_name AS player1_last_name,
 p2.player_id AS player2_id,
 p2.first_name AS player2_first_name,
 p2.last_name AS player2_last_name,
 SUM(CASE WHEN t.winner_id = p1.player_id THEN 1 ELSE 0 END) AS p1_wins,
 SUM(CASE WHEN t.winner_id = p2.player_id THEN 1 ELSE 0 END) AS p2_wins,
 COUNT(*) AS total_matches,
 ROUND(SUM(CASE WHEN t.winner_id = p1.player_id THEN 1 ELSE 0 END) / COUNT(*), 2) AS p1_win_percentage,
 ROUND(SUM(CASE WHEN t.winner_id = p2.player_id THEN 1 ELSE 0 END) / COUNT(*), 2) AS p2_win_percentage
FROM Tournament_Men t
JOIN Player_Men p1 ON t.winner_id = p1.player_id
JOIN Player_Men p2 ON t.loser_id = p2.player_id
WHERE (p1.player_id = specified_player1_id AND p2.player_id = specified_player2_id)
  OR (p1.player_id = specified_player2_id AND p2.player_id = specified_player1_id)
GROUP BY p1.player_id, p2.player_id, p1.first_name, p1.last_name, p2.first_name,



