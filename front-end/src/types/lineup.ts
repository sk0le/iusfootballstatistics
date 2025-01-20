export interface PlayerPosition {
  position: string;
  from: string;
  to: string | null;
  fromPeriod: string;
  toPeriod: string | null;
  startReason: string;
  endReason: string | null;
}

export interface PlayerCard {
  type: string;
  reason: string;
  time: string;
  period: number;
}

export interface PlayerInfo {
  playerId: number;
  playerName: string;
  nickname: string | null;
  jerseyNumber: number;
  country: string;
  positions: PlayerPosition[];
  cards: PlayerCard[];
}

export interface LineupResponse {
  teamId: number;
  teamName: string;
  lineup: PlayerInfo[];
}