import { ICompetition } from "@/types/competition";

export const CompetitionCard = ({ competition }: { competition: ICompetition }) => {
  return (
    <div className="glass-card rounded-lg p-4 transition-all duration-300 hover:scale-105 bg-secondary/10 border border-white/10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{competition.competition_name}</h3>
          <span className="text-xs text-muted-foreground">{competition.country_name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Season: {competition.season_name}</p>
          <p>Last Updated: {new Date(competition.match_updated).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2 mt-2">
          {competition.competition_international && (
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">International</span>
          )}
          {competition.competition_youth && (
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Youth</span>
          )}
        </div>
      </div>
    </div>
  );
};