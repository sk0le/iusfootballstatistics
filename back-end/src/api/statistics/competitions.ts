import express, { Request } from 'express';
import fs from 'node:fs';
import { DefaultMessage } from '../../interfaces/default';
import { ICompetition } from '../../interfaces/competition';

const router = express.Router();

router.get<Request, DefaultMessage<ICompetition[]>>('/', (req, res) => {
  fs.readFile('./src/data/competitions.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Could not read data file.',
        data: [],
      });
    }

    const obj = JSON.parse(data);

    return res.json({
      status: 'success',
      message: 'Successfully fetched competitions.',
      data: obj,
    });
  });
});

// Search function
router.get<Request, DefaultMessage<ICompetition[]>>('/search', (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'Query parameter "q" is required.',
      data: [],
    });
  }

  fs.readFile('./src/data/competitions.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Could not read data file.',
        data: [],
      });
    }

    const competitions: ICompetition[] = JSON.parse(data);

    const filteredCompetitions = competitions.filter((competition) => {
      const searchQuery = query.toLowerCase();
      return (
        competition.country_name.toLowerCase().includes(searchQuery) ||
        competition.competition_name.toLowerCase().includes(searchQuery) ||
        competition.season_name.toLowerCase().includes(searchQuery)
      );
    });

    res.json({
      status: 'success',
      message: 'Successfully fetched competitions.',
      data: filteredCompetitions,
    });
  });
});

interface TeamStats {
  MP: number;
  W: number;
  D: number;
  L: number;
  GF: number;
  GA: number;
  GD: number;
  Pts: number;
}

router.get<Request, DefaultMessage<TeamStats[]>>('/standings', (req, res) => {
  const competitionId = req.query.competitionId as string;
  const seasonId = req.query.seasonId as string;

  if (!competitionId || !seasonId) {
    return res.status(400).json({
      status: 'error',
      message: 'competitionId and seasonId are required query parameters.',
      data: [],
    });
  }

  const filePath = `./src/data/matches/${competitionId}/${seasonId}.json`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Could not read data file.',
        data: [],
      });
    }

    const matches = JSON.parse(data);
    const standings: Record<string, TeamStats> = {};

    matches.forEach((match: any) => {
      const homeTeam = match.home_team.home_team_name;
      const awayTeam = match.away_team.away_team_name;
      const homeGoals = match.home_score;
      const awayGoals = match.away_score;

      // Initialize teams in standings if not already present
      if (!standings[homeTeam]) {
        standings[homeTeam] = {
          MP: 0,
          W: 0,
          D: 0,
          L: 0,
          GF: 0,
          GA: 0,
          GD: 0,
          Pts: 0,
        };
      }

      if (!standings[awayTeam]) {
        standings[awayTeam] = {
          MP: 0,
          W: 0,
          D: 0,
          L: 0,
          GF: 0,
          GA: 0,
          GD: 0,
          Pts: 0,
        };
      }

      // Update matches played, goals for, and goals against
      standings[homeTeam].MP += 1;
      standings[awayTeam].MP += 1;

      standings[homeTeam].GF += homeGoals;
      standings[homeTeam].GA += awayGoals;
      standings[awayTeam].GF += awayGoals;
      standings[awayTeam].GA += homeGoals;

      // Update goal difference
      standings[homeTeam].GD = standings[homeTeam].GF - standings[homeTeam].GA;
      standings[awayTeam].GD = standings[awayTeam].GF - standings[awayTeam].GA;

      // Update wins, draws, losses, and points
      if (homeGoals > awayGoals) {
        standings[homeTeam].W += 1;
        standings[homeTeam].Pts += 3;
        standings[awayTeam].L += 1;
      } else if (homeGoals < awayGoals) {
        standings[awayTeam].W += 1;
        standings[awayTeam].Pts += 3;
        standings[homeTeam].L += 1;
      } else {
        standings[homeTeam].D += 1;
        standings[awayTeam].D += 1;
        standings[homeTeam].Pts += 1;
        standings[awayTeam].Pts += 1;
      }
    });

    // Convert standings object to an array and sort by points, goal difference, and goals scored
    const sortedStandings = Object.entries(standings)
      .map(([team, stats]) => ({ team, ...stats }))
      .sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF);

    return res.json({
      status: 'success',
      message: 'Successfully calculated league standings.',
      data: sortedStandings,
    });
  });
});

interface MatchInfo {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}

router.get<Request, DefaultMessage<MatchInfo[]>>('/matches', (req, res) => {
  const competitionId = req.query.competitionId as string;
  const seasonId = req.query.seasonId as string;

  if (!competitionId || !seasonId) {
    return res.status(400).json({
      status: 'error',
      message: 'competitionId and seasonId are required query parameters.',
      data: [],
    });
  }

  const filePath = `./src/data/matches/${competitionId}/${seasonId}.json`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Could not read data file.',
        data: [],
      });
    }

    const matches = JSON.parse(data);
    const matchInfo: MatchInfo[] = matches.map((match: any) => ({
      matchId: match.match_id,
      homeTeam: match.home_team.home_team_name,
      awayTeam: match.away_team.away_team_name,
      homeScore: match.home_score,
      awayScore: match.away_score,
      date: match.match_date,
    }));

    return res.json({
      status: 'success',
      message: 'Successfully fetched match data.',
      data: matchInfo,
    });
  });
});

interface PlayerInfo {
  playerId: number;
  playerName: string;
  nickname: string | null;
  jerseyNumber: number;
  country: string;
  positions: {
    position: string;
    from: string;
    to: string | null;
    fromPeriod: string;
    toPeriod: string | null;
    startReason: string;
    endReason: string | null;
  }[];
  cards: {
    type: string;
    reason: string;
    time: string;
    period: number;
  }[];
}

interface LineupResponse {
  teamId: number;
  teamName: string;
  lineup: PlayerInfo[];
}

router.get<Request, DefaultMessage<LineupResponse[]>>('/lineup', (req, res) => {
  const matchId = req.query.matchId as string;

  if (!matchId) {
    return res.status(400).json({
      status: 'error',
      message: 'matchId is a required query parameter.',
      data: [],
    });
  }

  const filePath = `./src/data/lineups/${matchId}.json`;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Could not read lineup data file.',
        data: [],
      });
    }

    const lineupData = JSON.parse(data);
    const lineupResponse: LineupResponse[] = lineupData.map((team: any) => ({
      teamId: team.team_id,
      teamName: team.team_name,
      lineup: team.lineup.map((player: any) => ({
        playerId: player.player_id,
        playerName: player.player_name,
        nickname: player.player_nickname || null,
        jerseyNumber: player.jersey_number,
        country: player.country?.name || 'Unknown',
        positions: player.positions.map((position: any) => ({
          position: position.position,
          from: position.from,
          to: position.to || null,
          fromPeriod: position.from_period,
          toPeriod: position.to_period || null,
          startReason: position.start_reason,
          endReason: position.end_reason || null,
        })),
        cards: player.cards.map((card: any) => ({
          type: card.card_type,
          reason: card.reason,
          time: card.time,
          period: card.period,
        })),
      })),
    }));

    return res.json({
      status: 'success',
      message: 'Successfully fetched lineup data.',
      data: lineupResponse,
    });
  });
});

export default router;
