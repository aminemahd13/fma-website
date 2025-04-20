import { CompetitionResult, deleteCompetitionResult, MedalType } from "@/lib/api/competition-results";
import { Button } from "@/components/shared/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table";

interface CompetitionResultListProps {
  competitionResults: CompetitionResult[];
  onEdit: (competitionResult: CompetitionResult) => void;
  onDelete: (id: number) => void;
}

// Function to get medal display information
const getMedalInfo = (medal: MedalType) => {
  switch (medal) {
    case MedalType.GOLD:
      return { label: 'Gold Medal', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    case MedalType.SILVER:
      return { label: 'Silver Medal', bgColor: 'bg-gray-200', textColor: 'text-gray-800' };
    case MedalType.BRONZE:
      return { label: 'Bronze Medal', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
    case MedalType.HONORABLE_MENTION:
      return { label: 'Honorable Mention', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    case MedalType.NONE:
    default:
      return { label: 'No Medal', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  }
};

export function CompetitionResultList({ 
  competitionResults, 
  onEdit, 
  onDelete 
}: CompetitionResultListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteCompetitionResult(id);
      onDelete(id);
    } catch (error) {
      console.error("Failed to delete competition result:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Medal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitionResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No competition results found. Add your first competition result.
              </TableCell>
            </TableRow>
          ) : (
            competitionResults.map((result) => {
              const medalInfo = getMedalInfo(result.medal);
              
              return (
                <TableRow key={result.id}>
                  <TableCell>{result.rank}</TableCell>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell>{result.school}</TableCell>
                  <TableCell>{result.score !== null ? result.score : '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${medalInfo.bgColor} ${medalInfo.textColor}`}>
                      {medalInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${result.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {result.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(result)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                      disabled={isDeleting === result.id}
                    >
                      {isDeleting === result.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
} 