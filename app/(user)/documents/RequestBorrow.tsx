"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { requestBorrowAction } from "./request-borrow-action";
import { toast } from "sonner";

export default function RequestBorrow({
  docId,
  borrowerId,
}: {
  docId: string;
  borrowerId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Request for borrowing</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request for borrowing</DialogTitle>
          <DialogDescription>
            Upon confirming, this will submit a request for borrowing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                await requestBorrowAction(docId, borrowerId);
                toast("Borrow request sent.");
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
