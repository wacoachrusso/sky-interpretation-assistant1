import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const SkyGuideAssistant = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`N. Holding Time
1. Flight Attendants shall receive one-half (1/2) credit for pay purposes, including premium pay and language pay when applicable, on an actual minute basis for all holding time, in excess of thirty (30) minutes beyond scheduled ground time or block arrival time. Flight Attendants will be paid such holding pay in addition to all other compensation.
(Article 7, Section 3.2, Paragraph 4, Page 23)`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Ask about your contract..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Get Answer"
          )}
        </Button>
      </form>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>SkyGuide Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkyGuideAssistant;