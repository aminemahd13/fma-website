import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Switch } from "@/components/shared/switch";
import { useState, useEffect } from "react";
import { CompetitionResult, CreateCompetitionResultData, MedalType, UpdateCompetitionResultData } from "@/lib/api/competition-results";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";

interface CompetitionResultFormProps {
  competitionResult?: CompetitionResult;
  onSubmit: (data: CreateCompetitionResultData | UpdateCompetitionResultData) => void;
  isSubmitting: boolean;
}

export function CompetitionResultForm({ 
  competitionResult, 
  onSubmit, 
  isSubmitting 
}: CompetitionResultFormProps) {
  const [rank, setRank] = useState<number>(1);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [score, setScore] = useState<number | undefined>(undefined);
  const [medal, setMedal] = useState<MedalType>(MedalType.NONE);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (competitionResult) {
      setRank(competitionResult.rank);
      setName(competitionResult.name);
      setSchool(competitionResult.school);
      setScore(competitionResult.score || undefined);
      setMedal(competitionResult.medal);
      setIsActive(competitionResult.isActive);
    }
  }, [competitionResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: CreateCompetitionResultData | UpdateCompetitionResultData = {
      rank,
      name,
      school,
      score: score || undefined,
      medal,
      isActive,
    };
    
    console.log("Form submitted with data:", formData);
    onSubmit(formData);
    console.log("Form submission handler called");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rank">Rank</Label>
        <Input
          id="rank"
          type="number"
          value={rank}
          onChange={(e) => setRank(parseInt(e.target.value))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Participant Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="score">Score</Label>
        <Input
          id="score"
          type="number"
          step="0.01"
          value={score || ""}
          onChange={(e) => setScore(e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medal">Medal</Label>
        <Select 
          value={medal} 
          onValueChange={(value) => setMedal(value as MedalType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a medal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MedalType.GOLD}>Gold Medal</SelectItem>
            <SelectItem value={MedalType.SILVER}>Silver Medal</SelectItem>
            <SelectItem value={MedalType.BRONZE}>Bronze Medal</SelectItem>
            <SelectItem value={MedalType.HONORABLE_MENTION}>Honorable Mention</SelectItem>
            <SelectItem value={MedalType.NONE}>No Medal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (competitionResult ? "Updating..." : "Creating...") 
          : (competitionResult ? "Update Competition Result" : "Create Competition Result")
        }
      </Button>
    </form>
  );
} 