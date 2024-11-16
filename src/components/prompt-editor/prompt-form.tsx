import React from "react";
import { Bot, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptFormProps {
  prompt: string;
  model: 'gpt-4' | 'gpt-3.5-turbo';
  isLoading: boolean;
  onPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onModelChange: (value: 'gpt-4' | 'gpt-3.5-turbo') => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

export function PromptForm({
  prompt,
  model,
  isLoading,
  onPromptChange,
  onModelChange,
  onSubmit,
  onSaveDraft,
}: PromptFormProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Prompt Editor</CardTitle>
        <CardDescription>Fine-tune your AI prompts here</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="prompt">Your Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={onPromptChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={onModelChange}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select AI Model" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Bot className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Fine-tune Prompt
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}