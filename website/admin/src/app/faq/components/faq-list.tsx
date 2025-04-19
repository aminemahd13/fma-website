import { FAQ, deleteFAQ } from "@/lib/api/faq";
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
import { useRouter } from "next/navigation";

interface FAQListProps {
  faqs: FAQ[];
  onEdit: (faq: FAQ) => void;
  onDelete: (id: number) => void;
}

export function FAQList({ faqs, onEdit, onDelete }: FAQListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const router = useRouter();
  
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteFAQ(id);
      onDelete(id);
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No FAQs found. Add your first FAQ entry.
              </TableCell>
            </TableRow>
          ) : (
            faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.question}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${faq.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {faq.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>{faq.order}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(faq)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(faq.id)}
                    disabled={isDeleting === faq.id}
                  >
                    {isDeleting === faq.id ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 