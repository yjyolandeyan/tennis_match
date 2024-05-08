# tennis_match

The primary goal of this project is to create an interactive and engaging platform for tennis enthusiasts, analysts, and casual fans to explore in-depth statistics and details of professional tennis players. We want to come up with a platform for fans to dive deeper into the careers and performances of their favorite players. Additionally, since we have all encountered situations where our favorite players have never played against each other, we also aim to provide a unique feature in this project where users can simulate tennis matches between players of their choice and on different court surfaces, with a prediction model based on the players’ previous ranking and winning statistics. These detailed statistics, match simulations, and historical data analysis can also be useful as educational tools for coaches who wish to draw insights on how to better make training plans or players to better understand their future opponents. 

## Architecture
We used Python to preprocess data and combine various csv files together based on year, tournament type, and/or gender. We used MySQL to write out the queries and create tables for the backend. To store the database for all the players and match information, we used MySQL-Connector hosted on AWS. While we tried to optimize certain queries using EXPLAIN in MySQL, some of them still take more than 10 seconds due to the sheer size of information that needs to be sorted and combined. To assist with optimization, we used Redis to help the performance of our queries, especially those under the Ranking page, since they are some of the most complex queries.  For the front end, we used Node.js for the server-side and React for the client-facing work. We used MUI’s DataGrid component to display tables as well as MUI’s Container, Typography, and Button components for styling and creating forms for user input.

## Web App Description
Below are descriptions of our Tennis Today web page with information about what the respective pages accomplish: 

**Player Card Page:**
This is where we combine the basic information (birthday, hand, country, height, etc.) of each player onto a single card to offer our users a comprehensive view of the player’s profile. We displayed this information as player cards for each player – including a profile photo pulled from the Unsplash API. Explore both men’s and women’s player cards on this page.

**Ranking Pages:**
We have three ranking pages, where we analyze historical data and provide users with information about player rankings. On Overall Ranking, a user can input the date, country, and count to find the top ranked players from a certain country in a certain year. Ranking by Years shows users the rank of players over the span of certain years using their average rank as well as their country of origin. Ranking by Gender allows users to select a gender and count to see the top players from each gender over all years, where they are ranked by number of matches played. 

**Match-up Page:**
On the match-up page, a prediction model will simulate a game between two players based on their statistics. The user can simulate a match between 2 men or 2 women. Once a user selects 2 players, their player cards will appear for viewing, as well as the winning statistic after the Simulate Match button is pressed. There is also a reset button, which will clear the current simulation. 

**Fun Facts Page:**
We also have four pages of fun facts, which are randomly selected when you go to “Fun Facts.” One page randomly selects a surface and then shows the best players on that surface, i.e., players with the highest win rates as well as most games played. Another Fun Fact page looks at player improvement over the years with a rotating list of players and their ranking changes over time. Another Fun Fact page shows the most unstable players, also known as the most volatile players, i.e., those with many wins but also many losses. The final Fun Fact page shows players with the most losses. 

## ER Diagram
<img width="669" alt="Screenshot 2024-05-08 at 5 11 59 PM" src="https://github.com/yjyolandeyan/tennis_match/assets/158221697/4a814ee7-e399-4fbc-9695-9fca701176e6">

