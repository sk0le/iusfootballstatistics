export interface ICompetition {
  competition_id: number;
  season_id: number;
  country_name: string;
  competition_name: string;
  competition_gender: string;
  competition_youth: boolean;
  competition_international: boolean;
  season_name: string;
  match_updated: string;
  match_updated_360: string;
  match_available_360: string;
  match_available: string;
}
