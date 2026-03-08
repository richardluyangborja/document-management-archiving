"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { borrowDocumentAction } from "./actions";
import { toast } from "sonner";

export default function ConfirmBorrow({
  transactionId,
}: {
  transactionId: string;
}) {
  return (
    <Button
      onClick={async () => {
        await borrowDocumentAction(transactionId);
        toast("Borrow request accepted.");
      }}
    >
      <Check />
    </Button>
  );
}
