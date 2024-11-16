import React from "react";
import { Clock, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface OutputDisplayProps {
  output: string;
  onShare: () => void;
  onViewHistory: () => void;
}

export function OutputDisplay({ output, onShare, onViewHistory }: OutputDisplayProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Output</CardTitle>
        <CardDescription>AI-generated response</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="min-h-[300px]"
          placeholder="AI output will appear here..."
          value={output}
          readOnly
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onShare}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" onClick={onViewHistory}>
          <Clock className="mr-2 h-4 w-4" />
          View History
        </Button>
      </CardFooter>
    </Card>
  );
}