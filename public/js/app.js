
const socket = io();
socket.on('hello', message => {
  console.log(message);
});


// current year(s) season for each league
const nhlSeason = '2018-2019';
const nbaSeason = '2018-2019';
const nflSeason = '2018';
const mlbSeason = '2019';

// League HTML variables, & standings content
const nhlBtn = document.getElementById('nhlBtn');
const nbaBtn = document.getElementById('nbaBtn');
const nflBtn = document.getElementById('nflBtn');
const mlbBtn = document.getElementById('mlbBtn');
const standingsDiv = document.getElementById('standings');
let nhlContent = '';
let nbaContent = '';
let nflContent = '';
let mlbContent = '';

// initially hide standings html until user clicks league button
standingsDiv.style.visibility = 'hidden';
standingsDiv.style.opacity = '0';

// reduce footer top margin when standings appear
const footer = document.getElementById('footer');
const footerMargin = () => {
  footer.style.marginTop = "2em";
}

// Show standings when corresponding league button is clicked
const showStandings = (e) => {
  if (e === nhlBtn) {
    standingsDiv.innerHTML = nhlContent;
  } else if (e === nbaBtn) {
    standingsDiv.innerHTML = nbaContent;
  } else if (e === nflBtn) {
    standingsDiv.innerHTML = nflContent;
  } else {
    standingsDiv.innerHTML = mlbContent;
  }
  standingsDiv.style.visibility = 'visible';
  standingsDiv.style.opacity = '1';
  document.querySelector('#select').style.display = 'none';
  footerMargin();
}

// Check if all 4 league data requests are complete
// If so, .btnContainer appears & user prompt text changes
let count = 0;
const isReady = () => {
  if (count === 4) {
    document.querySelector('#select').classList.remove('infinite');
    document.querySelector('#select').classList.add('bounceIn');
    // change user prompt text
    document.querySelector('#select').innerHTML = 'Please select a League';
    // unhide btnContainer containing league buttons
    document.querySelector('#btnContainer').style.opacity = '1';
  }
}


// Get standings function to call for each league
const getStandings = (data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league) => {

  let content = '';

  let allTeams = data.teams;

  // use totalTeamsEdit for if any rank #(s) are not assigned to any given team in return data
  let totalTeamsEdit = totalTeams;
  for (let rank = 1; rank <= totalTeamsEdit; rank++ ) {
  // checkRank checks if any rank #'s are not assigned to any given team in return data
  // example: rank 1, 2, 4, 5, 7 (where rank # 3 & 6 are missing, and not given to any team)
  const checkRank = (el) => {
    return el.overallRank.rank !== rank;
  }

  // if any rank #(s) are missing from return data
  // then 1 to totalTeamsEdit for each missing rank #
  // then use totalTeamsEdit in place of totalTeams in for loop
  if (allTeams.every(checkRank) === true) {
    totalTeamsEdit++;
    console.log(`overallRank.rank #${rank} is not assigned to a team in ${league} data returned from MySportsFeeds`);
  }
}

  // PUSH TEAMS INTO OVERALL STANDINGS, BASED ON OVERALL RANK
  for (let rank = 1; rank <= totalTeamsEdit; rank++ ) {

    for (let i = 0; i < totalTeams; i++) {
      if (data.teams[i].overallRank.rank === rank) {
        overallStandings.push(data.teams[i]);
      }
    }
  }

  //  Log overall standings to console
  //console.log(league + ' overall standings:');
  //console.log(overallStandings);

  // ORGANIZE OVERALL STANDINGS INTO DIVISIONS
  // for each division
  for (let d = 0; d < divisions.length; d++) {
    let current = [];

    // for each team
    for (let t = 0; t < data.teams.length; t++) {

      /*
      //  I USED THIS TO DEBUG MISSING RANK #'S IN RESPONSE DATA FROM MYSPORTSFEEDS.
      //  THIS HAS NOW BEEN SUPERSEDED BY checkRank FUNCTION ABOVE
      //  console log error message if object property is undefined
      // if (typeof overallStandings[t] === 'undefined') {
      //   console.log(`${league} team with index ${t} could not be found in overallStandings object,
      //                   when looping through ${divisions[d]} division. Team(s) may be missing from the DOM standings`);
      // }
      */

      // MLB league response data has duplicate division names,
      // therefore counter variable is used to distinguish which conference
      if (league === 'mlb') {
        let counter = 0;
        if (d >= 3) {
          counter = 1;
          }
        if ((overallStandings[t].divisionRank.divisionName === divisions[d]) && (overallStandings[t].conferenceRank.conferenceName === confs[counter])) {
          current.push(overallStandings[t]);
        }
      }
      // all leagues other than MLB
      else if (overallStandings[t].divisionRank.divisionName === divisions[d]) {
        current.push(overallStandings[t]);
      }

    } // end of each team loop

    divisionStandings.push(current);
  } // end of each division loop

  //  Log division standings to console
  //console.log(league + ' division standings:');
  //console.log(divisionStandings);


  // main title html
  content += `
    <div class="title">
      <h1>${league}: Regular Season Standings
  `;

  if (league === "nhl") {
    content += nhlSeason;
  } else if (league === "nba") {
    content += nbaSeason;
  } else if (league === "nfl") {
    content += nflSeason;
  } else {
    content += mlbSeason;
  }

  content += `
      </h1>
    </div>
  `;

  // each conference html
  for (let div = 0; div < divisions.length; div++) {
    // MLB league response data has duplicate division names,
    // therefore divCounter variable is used to distinguish which conference
    if (league === 'mlb') {
    let divCounter = 0;
      if (div >= 3) {
        divCounter = 1;
      }

      if ((divisions[div] === firstDivsInConfs[0]) && (divCounter === 0)) {
        content += `
          <div class="conf-title">
            <h2>${confs[0]} Conference</h2>
          </div>
        `;
      } else if ((divisions[div] === firstDivsInConfs[1]) && (divCounter === 1)) {
          content += `
            <div class="conf-title">
              <h2>${confs[1]} Conference</h2>
            </div>
          `;
      }
    }
    // all leagues other than MLB
    else {
      if (divisions[div] === firstDivsInConfs[0]) {
        content += `
          <div class="conf-title">
            <h2>${confs[0]} Conference</h2>
          </div>
        `;
      } else if (divisions[div] === firstDivsInConfs[1]) {
          content += `
            <div class="conf-title">
              <h2>${confs[1]} Conference</h2>
            </div>
          `;
      }
    }


    // start table for division
    content += `
      <table class="table">
        <thead>
          <tr>
            <th colspan="7">
    `;


    // each division title
    for (let d = 0; d < divisions.length; d++) {
      // MLB league response data has duplicate division names,
      // therefore divCounter variable is used to distinguish which conference
      if (league === 'mlb') {
        let dCounter = 0;
        if (d >= 3) {
          dCounter = 1;
        }
        if ((divisionStandings[div][0].divisionRank.divisionName === divisions[d]) && (divisionStandings[div][0].conferenceRank.conferenceName === confs[dCounter])) {
          content += `${divisions[d]} Division</th>`;
        }
      }
      // all leagues other than MLB
      else if (divisionStandings[div][0].divisionRank.divisionName === divisions[d]) {
        content += `${divisions[d]} Division</th>`;
      }
    }


    // table row headings
    content += `
      </tr>
      <tr>
      <td>Rank</td>
      <td class="text-left">Team</td>
      <td>GP</td>
      <td>W</td>
      <td>L</td>
    `;

    if ((league === "nba") || (league === "mlb")) {
      content += `
        <td>Win%</td>
        <td>GB</td>
      `;
    } else if (league === 'nfl') {
      content += `
        <td>T</td>
        <td>Win%</td>
      `;
    } else {
      content += `
        <td>OTL</td>
        <td>Pts</td>
      `;
    }

    content += `
        </tr>
      </thead>
      <tbody>
    `;


    // each team data row for current division
    for (let t = 0; t < divisionStandings[div].length; t++) {

      let teamName = divisionStandings[div][t].team.name.toLowerCase();
      teamName = teamName.replace(/\s/g, '');


      content += `
        <tr>
        <td class="align-middle">${divisionStandings[div][t].divisionRank.rank}</td>
        <td class="text-left align-middle">
      `;

      //  change team website url for Portland Trail Blazers (NBA)
      if (teamName === 'trailblazers') {
        content += `<a href="https://www.${league}.com/blazers" target="_blank">`;
      }
      //  change team website url for Arizona Diamondbacks (MLB)
      else if (teamName === 'diamondbacks') {
        content += `<a href="https://www.${league}.com/dbacks" target="_blank">`;
      }
      //  all other team website url's
      else {
        content += `<a href="https://www.${league}.com/${teamName}" target="_blank">`;
      }

      content += `
            ${divisionStandings[div][t].team.city} ${divisionStandings[div][t].team.name}
          </a>
        </td>
        <td class="align-middle">${divisionStandings[div][t].stats.gamesPlayed}</td>
        <td class="align-middle">${divisionStandings[div][t].stats.standings.wins}</td>
        <td class="align-middle">${divisionStandings[div][t].stats.standings.losses}</td>
      `;


      if ( (league === 'nba') || (league === 'mlb') ) {
        content += `
            <td class="align-middle">${divisionStandings[div][t].stats.standings.winPct}</td>
            <td class="align-middle">${divisionStandings[div][t].overallRank.gamesBack}</td>
          </tr>
        `;
      } else if (league === 'nfl') {
        content += `
            <td class="align-middle">${divisionStandings[div][t].stats.standings.ties}</td>
            <td class="align-middle">${divisionStandings[div][t].stats.standings.winPct}</td>
          </tr>
        `;
      } else {
        content += `
            <td class="align-middle">${divisionStandings[div][t].stats.standings.overtimeLosses}</td>
            <td class="align-middle">${divisionStandings[div][t].stats.standings.points}</td>
          </tr>
        `;
      }

    } // end division -for- loop


    // end of table after all divisions are complete
    content += `
        </tbody>
      </table>
    `;
  } // end conference -for- loop


  // access html in global scope variable, standingsContent
  if (league === 'nhl') {
    nhlContent = content;
  } else if (league === 'nba') {
    nbaContent = content;
  } else if (league === 'nfl') {
    nflContent = content;
  } else {
    mlbContent = content;
  }

} // end getStandings function


/*=====================================================
  Receive data functions from index.js
  and execute getStandings function for each league
=====================================================*/

// Receive nhl data from index.js
socket.on('nhl-data', (data) => {
  let nhlData;
  nhlData = data;

  // console.log('this is the nhl data:');
  // console.log(nhlData);

  //let count = 0;
  // set nhl variables for getStandings function arguments
  const league = 'nhl';
  const confs = ['Eastern', 'Western'];
  const divisions = ["Atlantic", "Metropolitan", "Pacific", "Central"];
  const firstDivsInConfs = ['Atlantic', 'Pacific'];
  const totalTeams = data.teams.length;
  const overallStandings = [];
  const divisionStandings = [];

  // call getStandings function, passings nhl data & divisions
  getStandings(data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league);

  count++;
  isReady();
});


// Receive nba data from index.js
socket.on('nba-data', (data) => {
  let nbaData;
  nbaData = data;

  // console.log('this is the nba data:');
  // console.log(nbaData);

  //let count = 0;
  // set nba variables for getStandings function arguments
  const league = 'nba';
  const confs = ['Eastern', 'Western'];
  const divisions = ["Atlantic", "Central", "Southeast", "Northwest", "Pacific", "Southwest"];
  const firstDivsInConfs = ['Atlantic', 'Northwest'];
  const totalTeams = data.teams.length;
  const overallStandings = [];
  const divisionStandings = [];

  // call getStandings function, passings nba data & divisions
  getStandings(data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league);

  count++;
  isReady();
});


// Receive nfl data from index.js
socket.on('nfl-data', (data) => {
  let nflData;
  nflData = data;

  // console.log('this is the nfl data:');
  // console.log(nflData);

  //let count = 0;
  // set nfl variables for getStandings function arguments
  const league = 'nfl';
  const confs = ['AFC', 'NFC'];
  const divisions = ["AFC East", "AFC North", "AFC South", "AFC West", "NFC East", "NFC North", "NFC South", "NFC West"];
  const firstDivsInConfs = ['AFC East', 'NFC East'];
  const totalTeams = data.teams.length;
  const overallStandings = [];
  const divisionStandings = [];

  // call getStandings function, passings nfl data & divisions
  getStandings(data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league);

  count++;
  isReady();
});


// Receive mlb data from index.js
socket.on('mlb-data', (data) => {
  let mlbData;
  mlbData = data;

  // console.log('this is the mlb data:');
  // console.log(mlbData);

  // set mlb variables for getStandings function arguments
  const league = 'mlb';
  const confs = ['American League', 'National League'];
  const divisions = ["East", "Central", "West", "East", "Central", "West"];
  const firstDivsInConfs = ['East', 'East'];
  const totalTeams = data.teams.length;
  const overallStandings = [];
  const divisionStandings = [];

  // call getStandings function, passings mlb data & divisions
  getStandings(data, totalTeams, confs, firstDivsInConfs, divisions, divisionStandings, overallStandings, league);

  count++;
  isReady();
});
