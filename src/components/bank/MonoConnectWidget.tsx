
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

interface MonoConnectWidgetProps {
  onSuccess?: () => void;
}

interface MonoData {
  getAccountId: () => string;
  getAccountName: () => string;
  getAccountNumber: () => string;
  getBankName: () => string;
  code: string;
}

export const MonoConnectWidget = ({ onSuccess }: MonoConnectWidgetProps) => {
  const { toast } = useToast();
  const monoConnectRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://connect.mono.co/connect.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSuccess = async (data: MonoData) => {
    try {
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      // Generate a secure webhook secret for this account
      const webhookSecret = crypto.randomUUID();
      
      // Store the account info along with the webhook secret
      const { error } = await supabase
        .from('bank_accounts')
        .insert({
          mono_account_id: data.getAccountId(),
          account_name: data.getAccountName(),
          account_number: data.getAccountNumber(),
          bank_name: data.getBankName(),
          webhook_secret: webhookSecret,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Bank account linked successfully!",
        description: "Your transactions will be synced shortly.",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error linking bank account",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setupMonoConnect = () => {
    if (window.MonoConnect) {
      const monoInstance = new window.MonoConnect({
        key: "live_pk_q8wDKGKbN8rdbxvgCVd5", // This is just an example
        onSuccess: handleSuccess,
        onClose: () => console.log("Widget closed"),
      });
      monoConnectRef.current = monoInstance;
    }
  };

  const openMonoWidget = () => {
    if (monoConnectRef.current) {
      monoConnectRef.current.open();
    } else {
      setupMonoConnect();
      setTimeout(() => monoConnectRef.current?.open(), 100);
    }
  };

  return (
    <Button
      onClick={openMonoWidget}
      className="bg-primary hover:bg-primary/90"
    >
      Link Bank Account
    </Button>
  );
};
