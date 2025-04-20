'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { getAllCompetitionResults } from "@/api/CompetitionResultsApi";
import { useEffect, useState } from "react";

// Update interface to match actual database schema, without year
interface CompetitionResult {
  id: number;
  rank: number;
  name: string;
  school: string;
  score?: number;
  medal: 'gold' | 'silver' | 'bronze' | 'honorable_mention' | 'none';
  isActive: boolean;
}

export default function PastEditionPage() {
  const [results, setResults] = useState<CompetitionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getAllCompetitionResults();
        // If data is an array, use it directly, otherwise check if there's a nested array
        const resultsData = Array.isArray(data) ? data : data?.results || [];
        console.log("API Response:", data); // Log the actual API response for debugging
        setResults(resultsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching competition results:', err);
        setError('Une erreur est survenue lors du chargement des résultats');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const goldGradient = 'bg-gradient-to-r from-transparent to-[#FFCF40]';
  const silverGradient = 'bg-gradient-to-r from-transparent to-[#D3D3D3]';
  const bronzeGradient = 'bg-gradient-to-r from-transparent to-[#cd7f32]';
  const honorableGradient = 'bg-gradient-to-r from-transparent to-sky-300';

  const getGradient = (medal: string) => {
    switch(medal) {
      case 'gold': return goldGradient;
      case 'silver': return silverGradient;
      case 'bronze': return bronzeGradient;
      case 'honorable_mention': return honorableGradient;
      default: return '';
    }
  }

  const getPrize = (medal: string, rank: number) => {
    // First check rank for specific placements
    switch(rank) {
      case 1: return "Premier prix";
      case 2: return "Deuxième prix";
      case 3: return "Troisième prix";
      default:
        // If not top 3, fall back to medal type
        switch(medal) {
          case 'gold': return "Médaille d'or";
          case 'silver': return "Médaille d'argent";
          case 'bronze': return "Médaille de bronze";
          case 'honorable_mention': return "Mention honorable";
          default: return '';
        }
    }
  }

  return (
    <div className="w-full md:max-w-5xl px-5 xl:px-0">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        Résultats <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MTYM</span>
      </h1>

      <div
        className="flex justify-around flex-wrap gap-6 md:p-8 animate-fade-up opacity-0"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        {loading ? (
          <div className="text-center py-8">Chargement des résultats...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">Aucun résultat disponible</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Classement</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>École/Institution</TableHead>
                {results.some(result => result.score !== undefined && result.score !== null) && (
                  <TableHead>Score</TableHead>
                )}
                <TableHead className="text-right">Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id} className={getGradient(result.medal)}>
                  <TableCell className="font-medium">{result.rank}</TableCell>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.school}</TableCell>
                  {results.some(result => result.score !== undefined && result.score !== null) && (
                    <TableCell>{result.score || '-'}</TableCell>
                  )}
                  <TableCell className="text-right">{getPrize(result.medal, result.rank)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>      
    </div>
  )
}

