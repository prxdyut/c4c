import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Animal type must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age is required.",
  }),
  gender: z.string().optional(),
  temperament: z.string().optional(),
  healthNotes: z.string().optional(),
  backstory: z.string().optional(),
  idealHome: z.string().optional(),
});

export type AnimalData = z.infer<typeof formSchema>;

export interface AnimalFormProps {
  onGenerate: (data: AnimalData) => void;
  isLoading?: boolean;
  initialData?: Partial<AnimalData>;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onGenerate, isLoading = false, initialData = {} }) => {
  const form = useForm<AnimalData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: initialData.type || "",
      age: "",
      gender: "",
      temperament: initialData.temperament || "",
      healthNotes: "",
      backstory: "",
      idealHome: "",
    },
  });

  function onSubmit(values: AnimalData) {
    onGenerate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Create Adoption Profile</h2>
          <p className="text-muted-foreground">Fill in the details to generate a compelling adoption profile.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pet's name" {...field} />
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
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dog, Cat, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Male, Female" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="temperament"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperament (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Friendly, Playful, Calm" {...field} />
              </FormControl>
              <FormDescription>
                Describe the pet's personality traits
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any important health information..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backstory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backstory (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share the pet's background story..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idealHome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ideal Home (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the perfect home for this pet..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Profile'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AnimalForm;
