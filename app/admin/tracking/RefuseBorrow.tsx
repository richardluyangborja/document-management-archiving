"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { refuseBorrowAction } from "./actions";
import { toast } from "sonner";

export default function RefuseBorrow({
  transactionId,
}: {
  transactionId: string;
}) {
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        await refuseBorrowAction(transactionId);
        toast("Borrow request refused");
      }}
    >
      <X />
    </Button>
  );
}
