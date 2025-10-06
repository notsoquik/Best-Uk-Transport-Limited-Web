"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Fuel, Droplet, TrendingUp, Users, TruckIcon, Receipt, PoundSterling } from "lucide-react"
import type { FuelRecord } from "@/lib/storage"
import { calculateMonthlyStats } from "@/lib/storage"
import { generateMonthlyReportPDF } from "@/lib/report-pdf-generator"
import { useToast } from "@/hooks/use-toast"

interface MonthlyReportProps {
  records: FuelRecord[]
  month: string
}

export function MonthlyReport({ records, month }: MonthlyReportProps) {
  const { toast } = useToast()
  const stats = calculateMonthlyStats(records)

  const handleDownloadPDF = async () => {
    try {
      await generateMonthlyReportPDF(records, month, stats)
      toast({
        title: "Success!",
        description: "Monthly report PDF has been downloaded.",
      })
    } catch (error) {
      console.error("[v0] Error generating monthly report PDF:", error)
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
          <p className="text-muted-foreground">There are no fuel records for {month}</p>
        </CardContent>
      </Card>
    )
  }

  const monthName = new Date(month + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">Monthly Report</CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">{monthName}</CardDescription>
            </div>
            <Button onClick={handleDownloadPDF} size="lg" className="w-full sm:w-auto h-12 text-base">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-8 h-8 text-brand/30" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Total Reports</p>
            <p className="text-3xl font-bold text-brand">{stats.totalRecords}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Fuel className="w-8 h-8 text-brand/30" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Total Diesel</p>
            <p className="text-3xl font-bold text-brand">{stats.totalDiesel} L</p>
            <p className="text-xs text-muted-foreground mt-1">Avg: £{stats.avgDieselPrice}/L</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="w-8 h-8 text-accent/30" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Total AdBlue</p>
            <p className="text-3xl font-bold text-accent-foreground">{stats.totalAdblue} L</p>
            <p className="text-xs text-muted-foreground mt-1">Avg: £{stats.avgAdbluePrice}/L</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <PoundSterling className="w-8 h-8 text-green-600/30" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Total Spending</p>
            <p className="text-3xl font-bold text-foreground">£{stats.totalSpending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-brand/5 rounded-lg border border-brand/20">
              <div className="flex items-center gap-3">
                <Fuel className="w-6 h-6 text-brand" />
                <div>
                  <p className="font-semibold text-brand">Diesel Costs</p>
                  <p className="text-sm text-muted-foreground">{stats.totalDiesel} litres consumed</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-brand">£{stats.totalDieselCost}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3">
                <Droplet className="w-6 h-6 text-accent-foreground" />
                <div>
                  <p className="font-semibold text-accent-foreground">AdBlue Costs</p>
                  <p className="text-sm text-muted-foreground">{stats.totalAdblue} litres consumed</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-accent-foreground">£{stats.totalAdblueCost}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Other Expenses</p>
                  <p className="text-sm text-muted-foreground">Parking, tolls, etc.</p>
                </div>
              </div>
              <p className="text-2xl font-bold">£{stats.totalOtherCost}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand/20 to-accent/20 rounded-lg border-2 border-brand/30">
              <div className="flex items-center gap-3">
                <PoundSterling className="w-6 h-6 text-brand" />
                <p className="text-lg font-bold">Grand Total</p>
              </div>
              <p className="text-3xl font-bold text-brand">£{stats.totalSpending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* By Driver Statistics */}
      {Object.keys(stats.byDriver).length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-6 h-6 text-brand" />
              Statistics by Driver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byDriver)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([driver, data]) => (
                  <div key={driver} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">{driver}</p>
                      <p className="text-sm text-muted-foreground">{data.count} report(s)</p>
                    </div>
                    <p className="text-xl font-bold text-brand">£{data.total.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* By Truck Statistics */}
      {Object.keys(stats.byTruck).length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TruckIcon className="w-6 h-6 text-brand" />
              Statistics by Truck
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byTruck)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([truck, data]) => (
                  <div key={truck} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">{truck.toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">{data.count} report(s)</p>
                    </div>
                    <p className="text-xl font-bold text-brand">£{data.total.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
