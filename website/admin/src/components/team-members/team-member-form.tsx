"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { TeamMember } from '@/lib/api/team-members';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  imageSrc: z.string().min(1, { message: 'Image source is required' }),
  linkedinSrc: z.string().optional(),
  portfolioSrc: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().nonnegative().default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMemberFormProps {
  initialData?: TeamMember;
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

export default function TeamMemberForm({ initialData, onSubmit, isLoading }: TeamMemberFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      imageSrc: initialData.imageSrc,
      linkedinSrc: initialData.linkedinSrc || '',
      portfolioSrc: initialData.portfolioSrc || '',
      category: initialData.category,
      isActive: initialData.isActive,
      order: initialData.order,
    } : {
      name: '',
      imageSrc: '',
      linkedinSrc: '',
      portfolioSrc: '',
      category: 'organizingCommittee',
      isActive: true,
      order: 0,
    },
  });

  const [previewImage, setPreviewImage] = useState<string>(initialData?.imageSrc || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPreviewImage(value);
    form.setValue('imageSrc', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="organizingCommittee">Organizing Committee</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="webDevelopment">Web Development</SelectItem>
                    <SelectItem value="brandDesign">Brand & Design</SelectItem>
                    <SelectItem value="um6p">UM6P</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="/organizing-team/image.jpg" 
                    onChange={handleImageChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center p-4 border rounded-lg">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-h-40 object-contain"
                onError={() => setPreviewImage('')}
              />
            ) : (
              <div className="text-gray-400">Image preview</div>
            )}
          </div>

          <FormField
            control={form.control}
            name="linkedinSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioSrc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://portfolio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Member will be displayed on the website when active
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Team Member' : 'Add Team Member'}
        </Button>
      </form>
    </Form>
  );
}