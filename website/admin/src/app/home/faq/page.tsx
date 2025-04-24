"use client";

import { useEffect, useState } from "react";
import { FAQ, createFAQ, fetchFAQs, updateFAQ } from "@/lib/api/faq";
import { FAQForm } from "@/app/home/faq/components/faq-form";
import { FAQList } from "@/app/home/faq/components/faq-list";
import { Button } from "@/components/shared/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shared/dialog";
import { toast } from "sonner";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFAQs();
      console.log("Loaded FAQs:", data);
      setFaqs(data);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      toast.error("Failed to load FAQs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFaq = async (formData: any) => {
    console.log("Creating FAQ with data:", formData);
    setIsSubmitting(true);
    try {
      const newFaq = await createFAQ(formData);
      console.log("Created new FAQ:", newFaq);
      setFaqs((prevFaqs) => [...prevFaqs, newFaq]);
      toast.success("FAQ created successfully");
      // Close dialog after successful creation
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      toast.error("Failed to create FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFaq = async (formData: any) => {
    if (!selectedFaq) return;
    console.log("Updating FAQ with data:", formData);
    setIsSubmitting(true);
    try {
      const updatedFaq = await updateFAQ(selectedFaq.id, formData);
      console.log("Updated FAQ:", updatedFaq);
      setFaqs(faqs.map(faq => faq.id === updatedFaq.id ? updatedFaq : faq));
      setIsEditing(false);
      setSelectedFaq(null);
      toast.success("FAQ updated successfully");
    } catch (error) {
      console.error("Failed to update FAQ:", error);
      toast.error("Failed to update FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = (id: number) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
    toast.success("FAQ deleted successfully");
  };

  const startEditing = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsEditing(true);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="from-black to-stone-500 bg-clip-text text-4xl font-medium">
          FAQ Management
        </h1>
        <Button onClick={openDialog}>Add New FAQ</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New FAQ</DialogTitle>
          </DialogHeader>
          <FAQForm onSubmit={handleCreateFaq} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {isLoading ? (
          <p>Loading FAQs...</p>
        ) : (
          <>
            {isEditing && selectedFaq ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Edit FAQ</h2>
                <FAQForm 
                  faq={selectedFaq} 
                  onSubmit={handleUpdateFaq} 
                  isSubmitting={isSubmitting} 
                />
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFaq(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <FAQList
                faqs={faqs}
                onEdit={startEditing}
                onDelete={handleDeleteFaq}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 