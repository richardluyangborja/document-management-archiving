import { Card, CardContent } from "@/components/ui/card"
import DataTable from "./DataTable"
import { UserRound, Wifi, Wrench } from "lucide-react"

export default function page() {
  return (
    <>
      <header className="p-4">
        <p className="text-2xl font-semibold">Audit Trail</p>
        <p className="text-lg font-light text-muted-foreground">Complete log of all system operations and modifications.</p>
      </header>
      <section className="grid grid-cols-12 gap-12 px-4 py-4">
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Total Operations</p>
            <div className="flex items-center gap-2">
              <Wrench />
              <p className="text-2xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Unique IP Addresses</p>
            <div className="flex items-center gap-2">
              <Wifi />
              <p className="text-2xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Unique actors</p>
            <div className="flex items-center gap-2">
              <UserRound />
              <p className="text-2xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="px-4">
        <DataTable data={[]} />
      </section>
    </>
  )
}

