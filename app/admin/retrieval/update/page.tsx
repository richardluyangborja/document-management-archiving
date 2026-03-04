import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { data } from "../../storage/data";
import { DatePicker } from "./DatePicker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Clock, Folder, RotateCcw, UserRound } from "lucide-react";

export default function page() {
  return (
    <div className="h-dvh flex flex-col">
      <header className="p-4">
        <p className="text-2xl font-semibold">Update</p>
        <p className="text-lg font-light text-muted-foreground">
          Update or renew expired documents.
        </p>
      </header>
      <section className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Renew a document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <Field className="w-64 mb-4">
                  <FieldLabel>Select a document</FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {data.map((d, i) => (
                          <SelectItem key={i} value={d.subject}>
                            {d.documentType} - {d.subject}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Selected Document</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <p>Version 1.0</p>
                      <p>Barangay Management</p>
                      <p>Mark Evangelista</p>
                    </div>
                  </CardContent>
                </Card>
                <DatePicker />
              </div>
              <Button size="lg">
                Renew document
                <RotateCcw />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
