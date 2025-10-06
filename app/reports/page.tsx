"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, TrendingUp, Truck } from "lucide-react"
import { getAllFuelRecords, getFuelRecordsByDate, getFuelRecordsByMonth, type FuelRecord } from "@/lib/storage"
import { DailyReport } from "@/components/daily-report"
import { MonthlyReport } from "@/components/monthly-report"

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"daily" | "monthly">("daily")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [dailyRecords, setDailyRecords] = useState<FuelRecord[]>([])
  const [monthlyRecords, setMonthlyRecords] = useState<FuelRecord[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const allRecords = getAllFuelRecords()
    setTotalRecords(allRecords.length)
  }, [])

  useEffect(() => {
    if (reportType === "daily") {
      const records = getFuelRecordsByDate(selectedDate)
      setDailyRecords(records)
    }
  }, [selectedDate, reportType])

  useEffect(() => {
    if (reportType === "monthly") {
      const [year, month] = selectedMonth.split("-").map(Number)
      const records = getFuelRecordsByMonth(year, month - 1)
      setMonthlyRecords(records)
    }
  }, [selectedMonth, reportType])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary p-3 sm:p-6 md:p-8 pb-24 sm:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Best UK Transport Limited
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground px-4">Fuel Reports & Analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Total Reports</p>
                  <p className="text-3xl font-bold text-brand">{totalRecords}</p>
                </div>
                <FileText className="w-10 h-10 text-brand/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Report Type</p>
                  <p className="text-2xl font-bold text-foreground capitalize">{reportType}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-accent/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold">Selected Period</p>
                  <p className="text-lg font-bold text-foreground">
                    {reportType === "daily" ? selectedDate : selectedMonth}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-secondary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Filters */}
        <Card className="mb-6 shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
            <CardTitle className="text-xl sm:text-2xl">Report Filters</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Select report type and date range to view fuel records
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={reportType} onValueChange={(value) => setReportType(value as "daily" | "monthly")}>
              <TabsList className="grid w-full grid-cols-2 h-12 sm:h-11">
                <TabsTrigger value="daily" className="text-base sm:text-sm font-semibold">
                  Daily Report
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-base sm:text-sm font-semibold">
                  Monthly Report
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-date" className="text-base font-semibold">
                      Select Date
                    </Label>
                    <Input
                      id="daily-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-base h-12"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing {dailyRecords.length} record(s) for {selectedDate}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-date" className="text-base font-semibold">
                      Select Month
                    </Label>
                    <Input
                      id="monthly-date"
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="text-base h-12"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing {monthlyRecords.length} record(s) for {selectedMonth}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Report Display */}
        {reportType === "daily" && <DailyReport records={dailyRecords} date={selectedDate} />}
        {reportType === "monthly" && <MonthlyReport records={monthlyRecords} month={selectedMonth} />}
      </div>
    </div>
  )
}
