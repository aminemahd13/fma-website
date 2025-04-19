"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/hooks/use-toast"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/shared/card"
import { Button } from "@/components/shared/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs"
import { LoadingSpinner } from "@/components/shared/icons/loading-spinner"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  PlusCircle, 
  GripVertical, 
  FileText, 
  type LucideIcon, 
  Settings, 
  Trash2, 
  Copy,
  ArrowUpDown,
  Eye,
  Check,
  X,
  Save
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form"
import { Input } from "@/components/shared/input"
import { Textarea } from "@/components/shared/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select"
import { Switch } from "@/components/shared/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shared/dialog"
import {
  getActiveFormSchema,
  getAllFormSchemas,
  createFormSchema,
  updateFormSchema,
  deleteFormSchema,
  activateFormSchema
} from "@/api/FormSchemaApi";

// Question type definitions
const questionTypes = [
  { id: 'text', label: 'Short Text', description: 'Single line text input' },
  { id: 'textarea', label: 'Long Text', description: 'Multi-line text input' },
  { id: 'email', label: 'Email', description: 'Email address input' },
  { id: 'number', label: 'Number', description: 'Numeric input' },
  { id: 'date', label: 'Date', description: 'Date picker' },
  { id: 'phone', label: 'Phone Number', description: 'Phone number input' },
  { id: 'select', label: 'Dropdown', description: 'Select from a list of options' },
  { id: 'radio', label: 'Multiple Choice', description: 'Select one option from a list' },
  { id: 'checkbox', label: 'Checkboxes', description: 'Select multiple options' },
  { id: 'file', label: 'File Upload', description: 'Upload a file' },
];

// Form schema for question editor
const questionSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string().min(1, { message: "Question label is required" }),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    fileTypes: z.array(z.string()).optional(),
    maxSize: z.number().optional(),
  }).optional(),
  conditionalLogic: z.object({
    dependsOn: z.string().optional(),
    condition: z.string().optional(),
    value: z.string().optional(),
  }).optional(),
});

// Section schema
const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Section title is required" }),
  description: z.string().optional(),
  order: z.number(),
});

// Component for displaying the form section in edit mode
const FormSection = ({ section, onEdit, onDelete, onReorder, onAddQuestion, onEditQuestion, onDeleteQuestion, onDuplicateQuestion }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">{section.title}</CardTitle>
          <CardDescription>{section.description}</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(section)}>
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {section.questions?.length > 0 ? (
          <Droppable droppableId={section.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {section.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center border rounded-md p-3 bg-white"
                      >
                        <div {...provided.dragHandleProps} className="mr-2">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{question.label} {question.required && <span className="text-red-500">*</span>}</div>
                          <div className="text-sm text-gray-500">{question.type}</div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => onEditQuestion(section.id, question)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDuplicateQuestion(section.id, {...question, id: `${question.id}-copy-${Date.now()}`})}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteQuestion(section.id, question.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <FileText className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No questions in this section</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onAddQuestion(section.id)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </CardFooter>
    </Card>
  );
};

// Question Editor Component
const QuestionEditor = ({ question, sectionId, onSave, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: question || {
      id: `question-${Date.now()}`,
      type: 'text',
      label: '',
      placeholder: '',
      description: '',
      required: false,
      order: 0,
      options: [],
      validation: {},
      conditionalLogic: {},
    },
  });

  const questionType = form.watch('type');
  const [options, setOptions] = useState(question?.options || []);

  // Add option
  const addOption = () => {
    setOptions([...options, { label: '', value: '' }]);
  };

  // Update option
  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  // Remove option
  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  const handleSubmit = (data) => {
    onSave(sectionId, { ...data, options });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Label</FormLabel>
                <FormControl>
                  <Input placeholder="Enter question label" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter additional instructions for this question"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter placeholder text" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(questionType === 'select' || questionType === 'radio' || questionType === 'checkbox') && (
          <div className="space-y-3">
            <FormLabel>Options</FormLabel>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                    placeholder="Option Label"
                    className="flex-1"
                  />
                  <Input
                    value={option.value}
                    onChange={(e) => updateOption(index, 'value', e.target.value)}
                    placeholder="Option Value"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {(questionType === 'number') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="validation.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Value</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validation.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Value</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {(questionType === 'file') && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="validation.fileTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed File Types</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. .pdf,.jpg,.png" 
                      {...field} 
                      value={Array.isArray(field.value) ? field.value.join(',') : field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of file extensions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validation.maxSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum File Size (KB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum file size in kilobytes (e.g. 5000 = 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required Question</FormLabel>
                <FormDescription>
                  Make this question mandatory for applicants
                </FormDescription>
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Question</Button>
        </div>
      </form>
    </Form>
  );
};

// Section Editor Component
const SectionEditor = ({ section, onSave, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: section || {
      id: `section-${Date.now()}`,
      title: '',
      description: '',
      order: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter section title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter section description"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Section</Button>
        </div>
      </form>
    </Form>
  );
};

// Form preview component
const FormPreview = ({ schema }) => {
  return (
    <div className="space-y-8">
      {schema.sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {section.questions?.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-center">
                  <label className="text-sm font-medium">
                    {question.label} {question.required && <span className="text-red-500">*</span>}
                  </label>
                </div>
                {question.description && (
                  <p className="text-sm text-gray-500">{question.description}</p>
                )}
                
                {question.type === 'text' && (
                  <Input placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'textarea' && (
                  <Textarea placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'email' && (
                  <Input type="email" placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'number' && (
                  <Input type="number" placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'date' && (
                  <Input type="date" placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'phone' && (
                  <Input type="tel" placeholder={question.placeholder || ''} disabled />
                )}
                
                {question.type === 'select' && (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder={question.placeholder || 'Select an option'} />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {question.type === 'radio' && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input type="radio" disabled />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input type="checkbox" disabled />
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'file' && (
                  <Input type="file" disabled />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main form builder component
export function FormBuilderSettings() {
  const [formSchema, setFormSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');
  const [isSaving, setIsSaving] = useState(false);
  const [formSchemas, setFormSchemas] = useState([]);
  const [currentFormSchemaId, setCurrentFormSchemaId] = useState(null);
  
  // Modal states
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  
  // Load form schemas and active schema
  useEffect(() => {
    const loadFormSchemas = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all form schemas
        const allSchemasResponse = await getAllFormSchemas() as any;
        if (allSchemasResponse?.statusCode === 200) {
          setFormSchemas(allSchemasResponse.formSchemas || []);
        }
        
        // Fetch active form schema
        const activeSchemaResponse = await getActiveFormSchema() as any;
        if (activeSchemaResponse?.statusCode === 200 && activeSchemaResponse.formSchema) {
          const schema = activeSchemaResponse.formSchema;
          setFormSchema(schema.schema);
          setCurrentFormSchemaId(schema.id);
        } else if (allSchemasResponse?.formSchemas?.length > 0) {
          // If no active schema, use the first one
          const firstSchema = allSchemasResponse.formSchemas[0];
          setFormSchema(firstSchema.schema);
          setCurrentFormSchemaId(firstSchema.id);
        } else {
          // If no schemas at all, create a default empty one
          setFormSchema({
            sections: []
          });
        }
      } catch (error) {
        toast({
          title: "Failed to load form schema",
          description: "Could not fetch the form schema. Please try again.",
          variant: "destructive",
        });
        
        // Set a default empty schema
        setFormSchema({
          sections: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormSchemas();
  }, []);
  
  // Save form schema
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (currentFormSchemaId) {
        // Update existing schema
        const response = await updateFormSchema(currentFormSchemaId, {
          schema: formSchema
        }) as any;
        
        if (response?.statusCode === 200) {
          toast({
            title: "Form saved",
            description: "The form schema has been saved successfully.",
          });
        } else {
          throw new Error('Failed to save form schema');
        }
      } else {
        // Create new schema
        const response = await createFormSchema({
          name: "Application Form",
          description: "Dynamic application form",
          schema: formSchema
        }) as any;
        
        if (response?.statusCode === 201) {
          setCurrentFormSchemaId(response.formSchema.id);
          toast({
            title: "Form created",
            description: "The form schema has been created successfully.",
          });
        } else {
          throw new Error('Failed to create form schema');
        }
      }
    } catch (error) {
      toast({
        title: "Failed to save form",
        description: "Could not save the form schema. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Add a new section
  const handleAddSection = () => {
    setCurrentSection(null);
    setSectionModalOpen(true);
  };
  
  // Edit a section
  const handleEditSection = (section) => {
    setCurrentSection(section);
    setSectionModalOpen(true);
  };
  
  // Save section
  const handleSaveSection = (data) => {
    setFormSchema(prev => {
      const isNew = !prev.sections.find(s => s.id === data.id);
      const sections = isNew
        ? [...prev.sections, { ...data, questions: [] }]
        : prev.sections.map(s => s.id === data.id ? { ...s, ...data } : s);
      
      return { ...prev, sections };
    });
    
    setSectionModalOpen(false);
  };
  
  // Delete section
  const handleDeleteSection = (sectionId) => {
    setFormSchema(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };
  
  // Add question
  const handleAddQuestion = (sectionId) => {
    setCurrentQuestion(null);
    setCurrentSectionId(sectionId);
    setQuestionModalOpen(true);
  };
  
  // Edit question
  const handleEditQuestion = (sectionId, question) => {
    setCurrentQuestion(question);
    setCurrentSectionId(sectionId);
    setQuestionModalOpen(true);
  };
  
  // Save question
  const handleSaveQuestion = (sectionId, question) => {
    setFormSchema(prev => {
      const sections = prev.sections.map(section => {
        if (section.id === sectionId) {
          const existingQuestion = section.questions?.find(q => q.id === question.id);
          const questions = existingQuestion 
            ? section.questions.map(q => q.id === question.id ? question : q)
            : [...(section.questions || []), question];
          
          return { ...section, questions };
        }
        return section;
      });
      
      return { ...prev, sections };
    });
    
    setQuestionModalOpen(false);
  };
  
  // Delete question
  const handleDeleteQuestion = (sectionId, questionId) => {
    setFormSchema(prev => {
      const sections = prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          };
        }
        return section;
      });
      
      return { ...prev, sections };
    });
  };
  
  // Duplicate question
  const handleDuplicateQuestion = (sectionId, question) => {
    setFormSchema(prev => {
      const sections = prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: [...section.questions, {
              ...question,
              id: `${question.id}-copy-${Date.now()}`,
              label: `${question.label} (Copy)`
            }]
          };
        }
        return section;
      });
      
      return { ...prev, sections };
    });
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // If reordering sections
    if (type === 'section') {
      const newSections = Array.from(formSchema.sections);
      const [moved] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, moved);
      
      // Update order values
      const orderedSections = newSections.map((section, index) => ({
        ...section,
        order: index
      }));
      
      setFormSchema({ ...formSchema, sections: orderedSections });
      return;
    }
    
    // If reordering questions within a section
    const sourceSectionId = source.droppableId;
    const destSectionId = destination.droppableId;
    
    // Find source and destination sections
    const sourceSection = formSchema.sections.find(s => s.id === sourceSectionId);
    const destSection = formSchema.sections.find(s => s.id === destSectionId);
    
    if (sourceSectionId === destSectionId) {
      // Reordering within the same section
      const newQuestions = Array.from(sourceSection.questions);
      const [moved] = newQuestions.splice(source.index, 1);
      newQuestions.splice(destination.index, 0, moved);
      
      // Update order values
      const orderedQuestions = newQuestions.map((question, index) => ({
        ...question,
        order: index
      }));
      
      setFormSchema({
        ...formSchema,
        sections: formSchema.sections.map(section => 
          section.id === sourceSectionId 
            ? { ...section, questions: orderedQuestions }
            : section
        )
      });
    } else {
      // Moving between sections
      const sourceQuestions = Array.from(sourceSection.questions);
      const [moved] = sourceQuestions.splice(source.index, 1);
      
      const destQuestions = Array.from(destSection.questions || []);
      destQuestions.splice(destination.index, 0, moved);
      
      // Update both sections
      setFormSchema({
        ...formSchema,
        sections: formSchema.sections.map(section => {
          if (section.id === sourceSectionId) {
            return { ...section, questions: sourceQuestions };
          }
          if (section.id === destSectionId) {
            return { ...section, questions: destQuestions };
          }
          return section;
        })
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
          <CardDescription>
            Create and customize your application form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <LoadingSpinner className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
          <CardDescription>
            Design your custom application form with drag-and-drop sections and questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="builder">
                <Settings className="h-4 w-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Form Sections</h3>
                  <Button onClick={handleAddSection}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections" type="section">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {formSchema.sections.map((section, index) => (
                          <Draggable
                            key={section.id}
                            draggableId={section.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div className="flex items-center mb-2">
                                  <div {...provided.dragHandleProps} className="mr-2">
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-500">
                                      SECTION {index + 1}
                                    </h3>
                                  </div>
                                </div>
                                <FormSection
                                  section={section}
                                  onEdit={handleEditSection}
                                  onDelete={handleDeleteSection}
                                  onReorder={() => {}}
                                  onAddQuestion={handleAddQuestion}
                                  onEditQuestion={handleEditQuestion}
                                  onDeleteQuestion={handleDeleteQuestion}
                                  onDuplicateQuestion={handleDuplicateQuestion}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                {formSchema.sections.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 border rounded-md border-dashed">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                    <p className="text-sm text-gray-500 text-center max-w-md mb-4">
                      Your form needs at least one section. Click the button below to add your first section.
                    </p>
                    <Button onClick={handleAddSection}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <FormPreview schema={formSchema} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            className="ml-auto"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Form
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Section Edit Modal */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentSection ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription>
              {currentSection 
                ? 'Update the details of this section'
                : 'Create a new section to organize your form questions'
              }
            </DialogDescription>
          </DialogHeader>
          
          <SectionEditor 
            section={currentSection}
            onSave={handleSaveSection}
            onCancel={() => setSectionModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Question Edit Modal */}
      <Dialog open={questionModalOpen} onOpenChange={setQuestionModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {currentQuestion ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              {currentQuestion 
                ? 'Update the details of this question'
                : 'Create a new question for your form'
              }
            </DialogDescription>
          </DialogHeader>
          
          <QuestionEditor 
            question={currentQuestion}
            sectionId={currentSectionId}
            onSave={handleSaveQuestion}
            onCancel={() => setQuestionModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}