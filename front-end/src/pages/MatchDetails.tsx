import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineupResponse } from "@/types/lineup";
import { MatchDetails as MatchDetailsType } from "@/types/match";
import { Shirt, Flag, Users, MapPin, User, Clock } from "lucide-react";

const MatchDetails = () => {
  const { id, competitionId, seasonId } = useParams();

  const { data: match } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/statistics/competitions/matches/${competitionId}/${seasonId}/${id}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data as MatchDetailsType;
    },
  });

  const { data: lineups, isLoading } = useQuery({
    queryKey: ["lineup", id],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/statistics/competitions/lineup?matchId=${id}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data as LineupResponse[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[0, 1].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(11)].map((_, j) => (
                    <div key={j} className="h-12 bg-muted rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {match && (
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {match.homeTeam} {match.homeScore} - {match.awayScore}{" "}
              {match.awayTeam}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              {match.date}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {lineups?.map((team) => (
          <Card key={team.teamId}>
            <CardHeader>
              <CardTitle>{team.teamName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Cards</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.lineup.map((player) => (
                    <TableRow key={player.playerId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shirt className="h-4 w-4" />
                          {player.jerseyNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {player.playerName}
                            {player.nickname && (
                              <span className="text-sm text-muted-foreground ml-2">
                                ({player.nickname})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Flag className="h-4 w-4" />
                            {player.country}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {player.positions.map((pos, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="mr-2 text-center"
                          >
                            {pos.position}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        {player.cards.map((card, index) => (
                          <Badge
                            key={index}
                            variant={
                              card.type.toLowerCase() === "yellow card"
                                ? "warning"
                                : "destructive"
                            }
                            className="mr-2 text-center"
                          >
                            {card.type}
                          </Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchDetails;
