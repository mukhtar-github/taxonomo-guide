
interface MonoConnectProps {
  key: string;
  onSuccess: (data: { code: string }) => void;
  onClose: () => void;
}

interface MonoConnect {
  new(props: MonoConnectProps): {
    open(): void;
  };
}

interface Window {
  MonoConnect: MonoConnect;
}
