
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

interface MonoConnectWidgetProps {
  onSuccess?: () => void;
}

export const MonoConnectWidget = ({ onSuccess }: MonoConnectWidgetProps) => {
  const { toast } = useToast();
  const monoConnectRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://connect.mono.co/connect.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSuccess = async (data: any) => {
    try {
      const { code } = data;
      // Here we'll need to call our backend to handle the Mono auth code
      // and fetch account details
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
        key: "YOUR_MONO_PUBLIC_KEY", // This should come from an environment variable
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
