## create database

CREATE DATABASE TENNIS; USE TENNIS;

CREATE TABLE Player_Men (
    player_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    hand CHAR(1),
    birth_date INT,
    country_id CHAR(3),
    height INT,
    gender INT DEFAULT 0
);


CREATE TABLE Tournament_Men (
    tourney_id VARCHAR(255),
    tourney_name VARCHAR(255),
    surface VARCHAR(50),
    draw_size INT,
    tourney_level VARCHAR(1),
    tourney_date INT,
    match_num INT NOT NULL,
    winner_id INT NOT NULL,
    winner_name VARCHAR(255),
    winner_hand CHAR(1),
    loser_id INT,
    loser_name VARCHAR(255),
    loser_hand CHAR(1),
    best_of INT,
    round VARCHAR(10),
    winner_rank INT,
    winner_rank_points INT,
    loser_rank INT,
    loser_rank_points INT,
    gender INT DEFAULT 1,
    INDEX idx_tourney_id (tourney_id),
    INDEX idx_match_num (match_num),
    PRIMARY KEY (tourney_id, match_num)
);

CREATE TABLE Tournament_Men_Qual (
    tourney_id VARCHAR(255),
    tourney_name VARCHAR(255),
    surface VARCHAR(50),
    draw_size INT,
    tourney_level VARCHAR(1),
    tourney_date INT,
    match_num INT NOT NULL,
    winner_id INT NOT NULL,
    winner_name VARCHAR(255),
    winner_hand CHAR(1),
    loser_id INT,
    loser_name VARCHAR(255),
    loser_hand CHAR(1),
    best_of INT,
    round VARCHAR(10),
    winner_rank INT,
    winner_rank_points INT,
    loser_rank INT,
    loser_rank_points INT,
    gender INT DEFAULT 1,
    INDEX idx_tourney_id (tourney_id),
    INDEX idx_match_num (match_num),
    PRIMARY KEY (tourney_id, match_num)
);


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


CREATE TABLE Ranking_Men_00(
    ranking_date INT,
    player_rank INT,
    player_id INT ,
    ranking_points INT,
    tours INT,
    gender INT DEFAULT 0,
    PRIMARY KEY(player_id, ranking_date)
);

CREATE TABLE Ranking_Men_20(
    ranking_date INT,
    player_rank INT,
    player_id INT ,
    ranking_points INT,
    tours INT,
    gender INT DEFAULT 0,
    PRIMARY KEY(player_id, ranking_date)
);

ALTER TABLE Tournament_Men ADD INDEX idx_tourney_id (tourney_id);
ALTER TABLE Tournament_Men ADD INDEX idx_match_num (match_num);


CREATE TABLE Player_Women (
    player_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    hand CHAR(1),
    birth_date INT,
    country_id CHAR(3),
    height INT,
    gender INT DEFAULT 1
);

CREATE TABLE Tournament_Women (
    tourney_id VARCHAR(255),
    tourney_name VARCHAR(255),
    surface VARCHAR(50),
    draw_size INT,
    tourney_level VARCHAR(1),
    tourney_date INT,
    match_num INT NOT NULL,
    winner_id INT NOT NULL,
    winner_name VARCHAR(255),
    winner_hand CHAR(1),
    loser_id INT,
    loser_name VARCHAR(255),
    loser_hand CHAR(1),
    best_of INT,
    round VARCHAR(10),
    winner_rank INT,
    winner_rank_points INT,
    loser_rank INT,
    loser_rank_points INT,
    gender INT DEFAULT 1,
    INDEX idx_tourney_id (tourney_id),
    INDEX idx_match_num (match_num),
    PRIMARY KEY (tourney_id, match_num)
);


CREATE TABLE Tournament_Women_Qual (
    tourney_id VARCHAR(255),
    tourney_name VARCHAR(255),
    surface VARCHAR(50),
    draw_size INT,
    tourney_level VARCHAR(1),
    tourney_date INT,
    match_num INT NOT NULL,
    winner_id INT NOT NULL,
    winner_name VARCHAR(255),
    winner_hand CHAR(1),
    loser_id INT,
    loser_name VARCHAR(255),
    loser_hand CHAR(1),
    best_of INT,
    round VARCHAR(10),
    winner_rank INT,
    winner_rank_points INT,
    loser_rank INT,
    loser_rank_points INT,
    gender INT DEFAULT 1,
    INDEX idx_tourney_id (tourney_id),
    INDEX idx_match_num (match_num),
    PRIMARY KEY (tourney_id, match_num)
);
