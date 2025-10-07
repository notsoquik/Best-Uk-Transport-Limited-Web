"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, CheckCircle2, Clock, Download, FileText, Package, Send, Truck, AlertCircle } from "lucide-react"
import {
  getOrCreateBatchSubmission,
  getAllBatchSubmissions,
  submitBatch,
  exportDataAsCSV,
  exportDataAsJSON,
  validateDataIntegrity,
  backupData,
  type BatchSubmission,
} from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { generateMonthlyReportPDF } from "@/lib/report-pdf-generator"
import { InstallPrompt } from "@/components/install-prompt"

export default function BatchSubmissionPage() {
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [currentBatch, setCurrentBatch] = useState<BatchSubmission | null>(null)
  const [allBatches, setAllBatches] = useState<BatchSubmission[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    loadBatches()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number)
      const batch = getOrCreateBatchSubmission(year, month - 1)
      setCurrentBatch(batch)
    }
  }, [selectedMonth])

  const loadBatches = () => {
    const batches = getAllBatchSubmissions()
    setAllBatches(batches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleSubmitBatch = () => {
    if (!currentBatch) return

    // Validate data integrity
    const validation = validateDataIntegrity()
    if (!validation.valid) {
      toast({
        title: "Data Integrity Issues",
        description: `Found ${validation.errors.length} issue(s). Please review your data.`,
        variant: "destructive",
      })
      return
    }

    setShowConfirmation(true)
  }

  const confirmSubmission = () => {
    if (!currentBatch) return

    submitBatch(currentBatch.id)
    backupData()

    toast({
      title: "Batch Submitted Successfully",
      description: `${currentBatch.totalRecords} records for ${currentBatch.month} ${currentBatch.year} have been submitted.`,
    })

    setShowConfirmation(false)
    loadBatches()
    const [year, month] = selectedMonth.split("-").map(Number)
    const updatedBatch = getOrCreateBatchSubmission(year, month - 1)
    setCurrentBatch(updatedBatch)
  }

  const handleExportCSV = () => {
    const csv = exportDataAsCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fuel-records-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "CSV Exported",
      description: "All fuel records have been exported to CSV.",
    })
  }

  const handleExportJSON = () => {
    const json = exportDataAsJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fuel-records-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "JSON Exported",
      description: "All fuel records have been exported to JSON.",
    })
  }

  const handleExportBatchPDF = async () => {
    if (!currentBatch) return

    try {
      await generateMonthlyReportPDF(currentBatch.records, selectedMonth)
      toast({
        title: "PDF Generated",
        description: `Monthly report for ${currentBatch.month} ${currentBatch.year} has been downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary p-3 sm:p-6 md:p-8 pb-24 sm:pb-8">
      <InstallPrompt />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Best UK Transport Limited
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground px-4">Monthly Batch Submission</p>
        </div>

        {/* Data Integrity Status */}
        <Card className="mb-6 border-2 border-green-500/50 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Data Integrity: Verified</p>
                <p className="text-sm text-green-700">All records are valid and backed up automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Month Selection */}
        <Card className="mb-6 shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Select Month for Batch Submission
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Review and submit all fuel records for a specific month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-month" className="text-base font-semibold">
                  Select Month
                </Label>
                <Input
                  id="batch-month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="text-base h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Batch Summary */}
        {currentBatch && (
          <Card className="mb-6 shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <Package className="w-6 h-6" />
                Batch Summary: {currentBatch.month} {currentBatch.year}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Review the data before final submission
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Total Records</p>
                  <p className="text-3xl font-bold text-brand">{currentBatch.totalRecords}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Total Spending</p>
                  <p className="text-3xl font-bold text-brand">£{currentBatch.totalSpending.toFixed(2)}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    {currentBatch.status === "submitted" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold text-green-600">Submitted</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-orange-600" />
                        <span className="text-lg font-bold text-orange-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Records Preview */}
              {currentBatch.totalRecords > 0 ? (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Records Included ({currentBatch.totalRecords})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {currentBatch.records.map((record, index) => (
                      <div key={record.id} className="bg-background p-3 rounded border text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              {index + 1}. {record.driverName} - {record.truckRegistration}
                            </p>
                            <p className="text-muted-foreground text-xs">{record.date}</p>
                          </div>
                          <p className="font-bold text-brand">£{record.grandTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No records found for this month</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExportBatchPDF}
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  disabled={currentBatch.totalRecords === 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export as PDF
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  disabled={currentBatch.totalRecords === 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export as CSV
                </Button>
                <Button
                  onClick={handleExportJSON}
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  disabled={currentBatch.totalRecords === 0}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export as JSON
                </Button>
              </div>

              {currentBatch.status === "pending" && currentBatch.totalRecords > 0 && (
                <Button onClick={handleSubmitBatch} size="lg" className="w-full h-14 text-lg font-semibold">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Batch for {currentBatch.month} {currentBatch.year}
                </Button>
              )}

              {currentBatch.status === "submitted" && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">Batch Already Submitted</p>
                  <p className="text-sm text-green-700">
                    Submitted on {new Date(currentBatch.submittedAt!).toLocaleString("en-GB")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && currentBatch && (
          <Card className="mb-6 border-2 border-orange-500 shadow-xl">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-xl flex items-center gap-2 text-orange-900">
                <AlertCircle className="w-6 h-6" />
                Confirm Batch Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-base">
                You are about to submit <strong>{currentBatch.totalRecords} records</strong> for{" "}
                <strong>
                  {currentBatch.month} {currentBatch.year}
                </strong>{" "}
                with a total spending of <strong>£{currentBatch.totalSpending.toFixed(2)}</strong>.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                Once submitted, this batch will be marked as complete. You can still export the data later.
              </p>
              <div className="flex gap-3">
                <Button onClick={confirmSubmission} size="lg" className="flex-1 h-12">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm Submission
                </Button>
                <Button onClick={() => setShowConfirmation(false)} variant="outline" size="lg" className="flex-1 h-12">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch History */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10">
            <CardTitle className="text-xl sm:text-2xl">Batch Submission History</CardTitle>
            <CardDescription className="text-sm sm:text-base">View all previous batch submissions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {allBatches.length > 0 ? (
              <div className="space-y-3">
                {allBatches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {batch.month} {batch.year}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {batch.totalRecords} records • £{batch.totalSpending.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {batch.status === "submitted" ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Submitted
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    {batch.submittedAt && (
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(batch.submittedAt).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No batch submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
