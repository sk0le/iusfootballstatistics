import { Team } from "@/types/team";

export const TeamCard = ({ team }: { team: Team }) => {
  return (
    <div className="glass-card rounded-lg p-4 transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-4">
        <img
          src={team.logo}
          alt={`${team.name} logo`}
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{team.name}</h3>
          <p className="text-muted-foreground text-sm">{team.league}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <p className="text-muted-foreground text-xs">Matches</p>
          <p className="font-mono text-lg">{team.matches}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Won</p>
          <p className="font-mono text-lg text-green-400">{team.won}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Points</p>
          <p className="font-mono text-lg text-primary">{team.points}</p>
        </div>
      </div>
    </div>
  );
};