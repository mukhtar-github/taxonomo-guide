
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

  const handleSuccess = async (data: MonoData) => {
    try {
      console.log("Mono success callback received:", data);
      
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      // Generate a secure webhook secret for this account
      const webhookSecret = crypto.randomUUID();
      
      console.log("Storing bank account data:", {
        mono_account_id: data.getAccountId(),
        account_name: data.getAccountName(),
        account_number: data.getAccountNumber(),
        bank_name: data.getBankName(),
      });

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
      console.error("Error in handleSuccess:", error);
      toast({
        title: "Error linking bank account",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Load Mono Connect script
    const script = document.createElement("script");
    script.src = "https://connect.mono.co/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Mono Connect script loaded");
      if (window.MonoConnect) {
        const monoInstance = new window.MonoConnect({
          key: "test_pk_dtwil4ti4e0x420nk7k1",
          onSuccess: handleSuccess,
          onClose: () => console.log("Widget closed"),
        });
        monoConnectRef.current = monoInstance;
        console.log("Mono instance initialized");
      } else {
        console.error("MonoConnect not found in window object");
      }
    };

    script.onerror = () => {
      console.error("Failed to load Mono Connect script");
      toast({
        title: "Error",
        description: "Failed to load bank connection widget",
        variant: "destructive",
      });
    };

    // Clean up script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openMonoWidget = () => {
    if (monoConnectRef.current) {
      console.log("Opening Mono widget");
      monoConnectRef.current.open();
    } else {
      console.error("Mono widget not initialized");
      toast({
        title: "Error",
        description: "Bank connection widget is not ready. Please try again.",
        variant: "destructive",
      });
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
