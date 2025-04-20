"use client";

import { useEffect, useState } from "react";
import { CompetitionResult, CreateCompetitionResultData, MedalType, updateCompetitionResult, updateAllCompetitionResultsActive } from "@/lib/api/competition-results";
import { CompetitionResultForm } from "@/app/competition-results/components/competition-result-form";
import { CompetitionResultList } from "@/app/competition-results/components/competition-result-list";
import { Button } from "@/components/shared/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shared/dialog";
import { Switch } from "@/components/shared/switch";
import { toast } from "sonner";
import { createCompetitionResult, fetchCompetitionResults } from "@/lib/api/competition-results";

function ResultsVisibilityToggle({ onToggleComplete }: { onToggleComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  
  useEffect(() => {
    const checkIfResultsActive = async () => {
      try {
        const data = await fetchCompetitionResults();
        // If we have results and at least one is active, consider results as published
        const published = Array.isArray(data) && data.length > 0 && data.some(result => result.isActive);
        setIsPublished(published);
      } catch (error) {
        console.error("Error checking results status:", error);
      }
    };
    
    checkIfResultsActive();
  }, []);

  const handleTogglePublishResults = async (checked: boolean) => {
    try {
      setIsLoading(true);
      await updateAllCompetitionResultsActive(checked);
      setIsPublished(checked);
      toast.success(checked 
        ? "Les résultats ont été publiés avec succès" 
        : "Les résultats ont été dépubliés avec succès"
      );
      if (onToggleComplete) {
        onToggleComplete();
      }
    } catch (error) {
      console.error("Error toggling results publication:", error);
      toast.error("Une erreur est survenue lors de la modification de la visibilité des résultats");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm mb-6">
      <div>
        <h3 className="text-lg font-medium">Visibilité des résultats</h3>
        <p className="text-sm text-gray-500">
          {isPublished 
            ? "Les résultats sont actuellement visibles sur le site" 
            : "Les résultats sont actuellement masqués"
          }
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {isLoading ? "Chargement..." : (isPublished ? "Publié" : "Non publié")}
        </span>
        <Switch
          checked={isPublished}
          onCheckedChange={handleTogglePublishResults}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default function CompetitionResultsPage() {
  const [competitionResults, setCompetitionResults] = useState<CompetitionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<CompetitionResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadCompetitionResults();
  }, []);

  const loadCompetitionResults = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCompetitionResults();
      console.log("Loaded Competition Results:", data);
      setCompetitionResults(data);
    } catch (error) {
      console.error("Failed to load competition results:", error);
      toast.error("Failed to load competition results. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResult = async (formData: CreateCompetitionResultData) => {
    console.log("handleCreateResult called with data:", formData);
    setIsSubmitting(true);
    try {
      console.log("About to call API to create competition result");
      const newResult = await createCompetitionResult(formData);
      console.log("Created new competition result:", newResult);
      setCompetitionResults((prevResults) => [...prevResults, newResult]);
      toast.success("Competition result created successfully");
      // Close dialog after successful creation
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create competition result:", error);
      toast.error("Failed to create competition result. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResult = async (formData: CreateCompetitionResultData) => {
    if (!selectedResult) return;
    
    console.log("Updating competition result with data:", formData);
    setIsSubmitting(true);
    try {
      const updatedResult = await updateCompetitionResult(selectedResult.id, formData);
      console.log("Updated competition result:", updatedResult);
      
      setCompetitionResults((prevResults) => 
        prevResults.map((result) => 
          result.id === updatedResult.id ? updatedResult : result
        )
      );
      
      toast.success("Competition result updated successfully");
      setIsEditing(false);
      setSelectedResult(null);
    } catch (error) {
      console.error("Failed to update competition result:", error);
      toast.error("Failed to update competition result. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResult = (id: number) => {
    setCompetitionResults((prevResults) => 
      prevResults.filter((result) => result.id !== id)
    );
    toast.success("Competition result deleted successfully");
  };

  const startEditing = (competitionResult: CompetitionResult) => {
    setSelectedResult(competitionResult);
    setIsEditing(true);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="from-black to-stone-500 bg-clip-text text-4xl font-medium">
          Competition Results Management
        </h1>
        <Button onClick={openDialog}>Add New Result</Button>
      </div>

      {/* Add the toggle component for bulk activation/deactivation */}
      <ResultsVisibilityToggle onToggleComplete={loadCompetitionResults} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Competition Result</DialogTitle>
          </DialogHeader>
          <CompetitionResultForm onSubmit={handleCreateResult} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading competition results...</p>
        ) : (
          <>
            {isEditing && selectedResult ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Edit Competition Result</h2>
                <CompetitionResultForm 
                  competitionResult={selectedResult} 
                  onSubmit={handleUpdateResult} 
                  isSubmitting={isSubmitting} 
                />
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedResult(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <CompetitionResultList
                competitionResults={competitionResults}
                onEdit={startEditing}
                onDelete={handleDeleteResult}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}