"use client";

import { Toaster } from "sonner";

export function SonnerProvider() {
  return (
    <Toaster
      richColors
      closeButton
      position="bottom-right"
      theme="system"
      toastOptions={{
        duration: 4000,
        className:
          "border border-border bg-background text-foreground shadow-lg",
        descriptionClassName: "text-muted-foreground",
      }}
    />
  );
}
