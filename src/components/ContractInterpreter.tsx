import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SkyGuideAssistant = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [queryCount, setQueryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const checkQueryCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_plan, query_count')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setQueryCount(profile.query_count || 0);
        }
      }
    };
    
    checkQueryCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      });
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan, query_count')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_plan === 'trial' && (profile?.query_count || 0) >= 2) {
      toast({
        title: "Trial Limit Reached",
        description: "You've reached your trial limit. Please upgrade to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(async () => {
        setResponse(`N. Holding Time
1. Flight Attendants shall receive one-half (1/2) credit for pay purposes, including premium pay and language pay when applicable, on an actual minute basis for all holding time, in excess of thirty (30) minutes beyond scheduled ground time or block arrival time. Flight Attendants will be paid such holding pay in addition to all other compensation.
(Article 7, Section 3.2, Paragraph 4, Page 23)`);
        
        // Update query count
        const { error } = await supabase
          .from('profiles')
          .update({ 
            query_count: (profile?.query_count || 0) + 1 
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating query count:', error);
        } else {
          setQueryCount((prev) => prev + 1);
        }
        
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
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
        {queryCount > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Queries used: {queryCount} {queryCount >= 2 ? "(Trial limit reached)" : ""}
          </p>
        )}
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