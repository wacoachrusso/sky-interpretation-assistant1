import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const QueryLimitChecker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkQueryLimit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('query_count, subscription_plan')
          .eq('id', user.id)
          .single();

        if (profile?.subscription_plan === 'trial' && profile?.query_count >= 2) {
          toast({
            title: "Free Trial Expired",
            description: "You've reached your free trial limit. Please upgrade to continue.",
          });
          navigate('/signup?expired=true');
        }
      } catch (error) {
        console.error('Error checking query limit:', error);
      }
    };

    checkQueryLimit();
  }, [navigate]);

  return null;
};