import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Switch } from "@/components/shared/switch";
import { useState, useEffect } from "react";
import { FAQ, CreateFAQData, UpdateFAQData } from "@/lib/api/faq";

interface FAQFormProps {
  faq?: FAQ;
  onSubmit: (data: CreateFAQData | UpdateFAQData) => void;
  isSubmitting: boolean;
}

export function FAQForm({ faq, onSubmit, isSubmitting }: FAQFormProps) {
  const [formData, setFormData] = useState<CreateFAQData | UpdateFAQData>({
    question: '',
    answer: '',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive,
        order: faq.order,
      });
    } else {
      // Reset form when creating a new FAQ
      setFormData({
        question: '',
        answer: '',
        isActive: true,
        order: 0,
      });
    }
  }, [faq]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, order: Number(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.question || !formData.answer) {
      console.error("Question and answer are required");
      return;
    }
    
    console.log("Form submitted with data:", formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          required
          placeholder="Enter the question"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer</Label>
        <textarea
          id="answer"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Enter the answer"
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          value={formData.order?.toString() ?? "0"}
          onChange={handleOrderChange}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full"
        onClick={(e) => {
          console.log("Submit button clicked");
          handleSubmit(e);
        }}
      >
        {isSubmitting ? "Saving..." : faq ? "Update FAQ" : "Create FAQ"}
      </Button>
    </form>
  );
} 