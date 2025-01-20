import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useMemo, useState } from "react";

import { themeQuartz } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const CompetitionDetails = () => {
  const { id, seasonId } = useParams();

  const [colDefs, setColDefs] = useState([
    { field: "team" },
    { field: "MP" },
    { field: "W" },
    { field: "L" },
    { field: "D" },
    { field: "GD" },
    { field: "GF" },
    { field: "GA" },
    { field: "Pts" },
  ]);

  const enableCharts = true;
  const cellSelection = useMemo(() => {
    return true;
  }, []);

  const { data: competition, isLoading: isLoadingCompetition } = useQuery({
    queryKey: ["competition", id],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/statistics/competitions/${id}/${seasonId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch competition");
      }
      const data = await response.json();
      return data.data;
    },
  });

  const { data: standings, isLoading: isLoadingStandings } = useQuery({
    queryKey: ["standings", id, seasonId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/statistics/competitions/standings?competitionId=${id}&seasonId=${seasonId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch standings");
      }
      const data = await response.json();
      console.log(data.data);
      return data.data;
    },
    enabled: !!id && !!seasonId,
  });

  const { data: matches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ["matches", id, seasonId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/statistics/competitions/matches?competitionId=${id}&seasonId=${seasonId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }
      const data = await response.json();
      console.log(data.data);
      return data.data;
    },
    enabled: !!id && !!seasonId,
  });

  const isLoading =
    isLoadingCompetition || isLoadingStandings || isLoadingMatches;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary/50 rounded w-1/4"></div>
          <div className="h-[200px] bg-secondary/50 rounded"></div>
          <div className="h-[400px] bg-secondary/50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col w-full p-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{competition?.competition_name}</h1>
        <p className="text-muted-foreground">
          Season: {competition?.season_name}
        </p>
      </header>

      {standings && standings.length > 0 && (
        <div style={{ height: 700 }} className="w-full">
          <AgGridReact
            gridOptions={{
              autoSizeStrategy: {
                type: "fitGridWidth",
                defaultMinWidth: 100,
              },
            }}
            defaultColDef={{ sortable: false }}
            theme={themeQuartz}
            rowData={standings}
            columnDefs={colDefs}
          />
        </div>
      )}

      {matches && matches.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match: any) => (
                <Link
                  key={match.matchId}
                  to={`/match/${id}/${seasonId}/${match.matchId}`}
                  className="block"
                >
                  <Card className="hover:bg-secondary/50 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="text-xl font-bold text-center">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="space-y-2">
                          <div className="font-semibold text-center">
                            {match.homeTeam} vs {match.awayTeam}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitionDetails;
