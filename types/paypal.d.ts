// Globale Typdeklaration für das PayPal-JS-SDK.
//
// Das SDK wird per <script> nachgeladen und hängt sich an `window.paypal`.
// Die Deklaration lag früher inline in `app/dashboard/[id]/MediationClient.tsx`
// und ist mit dem PayPal-Umbau (Zahlung raus aus dem Onboarding) dort
// verschwunden — dadurch brach der Build in `LogbuchClient.tsx`. Sie gehört
// ohnehin hierher: mehrere Stellen laden das SDK.

export {};

type PayPalButtonsConfig = {
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "gold" | "blue" | "silver" | "white" | "black";
    label?: string;
    shape?: "rect" | "pill";
    height?: number;
  };
  createOrder?: () => Promise<string>;
  onApprove?: (data: { orderID: string; payerID?: string }) => Promise<void> | void;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
};

type PayPalNamespace = {
  Buttons: (config: PayPalButtonsConfig) => {
    render: (container: HTMLElement | string) => Promise<void>;
    close?: () => void;
  };
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}
