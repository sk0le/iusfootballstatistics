import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { CompetitionCard } from "@/components/CompetitionCard";
import { ICompetition } from "@/types/competition";
import { API_BASE_URL } from "@/lib/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: competitions, isLoading } = useQuery({
    queryKey: ["competitions", searchQuery],
    queryFn: async () => {
      console.log(API_BASE_URL);
      const endpoint = searchQuery
        ? `${API_BASE_URL}/statistics/competitions/search?q=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/statistics/competitions`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredCompetitions = competitions || [];
  const totalPages = Math.ceil(filteredCompetitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompetitions = filteredCompetitions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen p-6 space-y-8 bg-background">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          IUS Football Statistics
        </h1>
        <p className="text-muted-foreground">
          Search and explore football competitions worldwide
        </p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-${i}`} className="glass-card rounded-lg h-48" />
          ))}
        </div>
      ) : (
        <>
          {currentCompetitions.length === 0 ? (
            <div className="w-full flex justify-center text-lg">
              There is no competition with that search query, try again...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {currentCompetitions.map((competition: ICompetition) => (
                <Link
                  key={`competition-${competition.competition_id}`}
                  to={`/competition/${competition.competition_id}/${competition.season_id}`}
                  className="block"
                >
                  <CompetitionCard competition={competition} />
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
