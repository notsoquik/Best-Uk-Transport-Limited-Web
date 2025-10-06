"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Fuel, Droplet, Receipt, User, TruckIcon, Gauge } from "lucide-react"
import type { FuelRecord } from "@/lib/storage"
import { generateDailyReportPDF } from "@/lib/report-pdf-generator"
import { useToast } from "@/hooks/use-toast"

interface DailyReportProps {
  records: FuelRecord[]
  date: string
}

export function DailyReport({ records, date }: DailyReportProps) {
  const { toast } = useToast()

  const handleDownloadPDF = async () => {
    try {
      await generateDailyReportPDF(records, date)
      toast({
        title: "Success!",
        description: "Daily report PDF has been downloaded.",
      })
    } catch (error) {
      console.error("[v0] Error generating daily report PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (records.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="pt-12 pb-12 text-center">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">No Records Found</h3>
          <p className="text-muted-foreground">There are no fuel records for {date}</p>
        </CardContent>
      </Card>
    )
  }

  const totalDiesel = records.reduce((sum, r) => sum + Number.parseFloat(r.dieselAdded || "0"), 0)
  const totalAdblue = records.reduce((sum, r) => sum + Number.parseFloat(r.adblueAdded || "0"), 0)
  const totalSpending = records.reduce((sum, r) => sum + r.grandTotal, 0)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Daily Report Summary</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">{date}</CardDescription>
            </div>
            <Button onClick={handleDownloadPDF} size="lg" className="w-full sm:w-auto h-12 text-base">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground font-semibold mb-1">Total Diesel</p>
              <p className="text-2xl font-bold text-brand">{totalDiesel.toFixed(2)} L</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground font-semibold mb-1">Total AdBlue</p>
              <p className="text-2xl font-bold text-accent-foreground">{totalAdblue.toFixed(2)} L</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground font-semibold mb-1">Total Spending</p>
              <p className="text-2xl font-bold text-foreground">£{totalSpending.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Records */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Individual Records ({records.length})</h3>
        {records.map((record) => (
          <Card key={record.id} className="border-2">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-brand" />
                  <CardTitle className="text-lg">{record.driverName}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TruckIcon className="w-4 h-4" />
                  <span className="font-semibold">{record.truckRegistration.toUpperCase()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mileage */}
              {record.mileage && (
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="font-semibold">{record.mileage} km</span>
                </div>
              )}

              {/* Fuel Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Diesel */}
                {record.dieselAdded && (
                  <div className="bg-brand/5 p-4 rounded-lg border border-brand/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="w-5 h-5 text-brand" />
                      <h4 className="font-semibold text-brand">Diesel</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Litres:</span>
                        <span className="font-semibold">{record.dieselAdded} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price/L:</span>
                        <span className="font-semibold">£{record.dieselPrice}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-brand">£{record.dieselTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AdBlue */}
                {record.adblueAdded && (
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="w-5 h-5 text-accent-foreground" />
                      <h4 className="font-semibold text-accent-foreground">AdBlue</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Litres:</span>
                        <span className="font-semibold">{record.adblueAdded} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price/L:</span>
                        <span className="font-semibold">£{record.adbluePrice}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-accent-foreground">£{record.adblueTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Expenses */}
              {record.otherExpenses && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Other Expenses</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{record.otherExpenses}</span>
                    <span className="font-semibold">£{record.otherTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-brand/20 to-accent/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Grand Total:</span>
                  <span className="text-2xl font-bold text-brand">£{record.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-muted-foreground text-right">Signed: {record.signatureTimestamp}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
