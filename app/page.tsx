"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Fuel, Droplet, FileText, Download, Camera, X, Shield } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { saveFuelRecord, backupData, validateDataIntegrity } from "@/lib/storage"
import { InstallPrompt } from "@/components/install-prompt"

interface FormData {
  date: string
  driverName: string
  truckRegistration: string
  mileage: string
  dieselAdded: string
  dieselPrice: string
  adblueAdded: string
  adbluePrice: string
  otherExpenses: string
  otherExpensesCost: string
  signature: string
  signatureTimestamp: string
  receiptImage: string
}

export default function FuelTrackingPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptPreview, setReceiptPreview] = useState<string>("")
  const [dataIntegrityStatus, setDataIntegrityStatus] = useState<{ valid: boolean; errors: string[] } | null>(null)

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    driverName: "",
    truckRegistration: "",
    mileage: "",
    dieselAdded: "",
    dieselPrice: "",
    adblueAdded: "",
    adbluePrice: "",
    otherExpenses: "",
    otherExpensesCost: "",
    signature: "",
    signatureTimestamp: "",
    receiptImage: "",
  })

  const handleDriverNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      driverName: value,
      signature: value,
      signatureTimestamp: value
        ? new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "",
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData((prev) => ({ ...prev, receiptImage: base64String }))
        setReceiptPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceiptImage = () => {
    setFormData((prev) => ({ ...prev, receiptImage: "" }))
    setReceiptPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const calculateTotals = () => {
    const dieselTotal = (Number.parseFloat(formData.dieselAdded) || 0) * (Number.parseFloat(formData.dieselPrice) || 0)
    const adblueTotal = (Number.parseFloat(formData.adblueAdded) || 0) * (Number.parseFloat(formData.adbluePrice) || 0)
    const otherTotal = Number.parseFloat(formData.otherExpensesCost) || 0
    const grandTotal = dieselTotal + adblueTotal + otherTotal

    return {
      dieselTotal: dieselTotal.toFixed(2),
      adblueTotal: adblueTotal.toFixed(2),
      otherTotal: otherTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }
  }

  useEffect(() => {
    const status = validateDataIntegrity()
    setDataIntegrityStatus(status)
    backupData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.driverName || !formData.truckRegistration) {
      toast({
        title: "Missing Information",
        description: "Please fill in driver name and truck registration.",
        variant: "destructive",
      })
      return
    }

    const hasDieselData = formData.dieselAdded || formData.dieselPrice
    const hasAdblueData = formData.adblueAdded || formData.adbluePrice
    const hasOtherExpenses = formData.otherExpenses || formData.otherExpensesCost

    if (!hasDieselData && !hasAdblueData && !hasOtherExpenses) {
      toast({
        title: "No Expense Data",
        description: "Please enter at least one expense (diesel, adblue, or other).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const finalFormData = {
        ...formData,
      }

      const totalsObj = calculateTotals()

      saveFuelRecord({
        ...finalFormData,
        dieselTotal: Number.parseFloat(totalsObj.dieselTotal),
        adblueTotal: Number.parseFloat(totalsObj.adblueTotal),
        otherTotal: Number.parseFloat(totalsObj.otherTotal),
        grandTotal: Number.parseFloat(totalsObj.grandTotal),
      })

      await generatePDF(finalFormData, totalsObj)

      toast({
        title: "Success!",
        description: "Record saved and PDF generated. Data automatically backed up.",
      })

      setFormData({
        date: new Date().toISOString().split("T")[0],
        driverName: "",
        truckRegistration: "",
        mileage: "",
        dieselAdded: "",
        dieselPrice: "",
        adblueAdded: "",
        adbluePrice: "",
        otherExpenses: "",
        otherExpensesCost: "",
        signature: "",
        signatureTimestamp: "",
        receiptImage: "",
      })
      setReceiptPreview("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      const status = validateDataIntegrity()
      setDataIntegrityStatus(status)
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to save record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totals = calculateTotals()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary p-3 sm:p-6 md:p-8">
      <InstallPrompt />

      <div className="max-w-4xl mx-auto pb-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
              Best UK Transport Limited
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground px-4">Fuel Intake & Spendings Report</p>
        </div>

        {dataIntegrityStatus && (
          <Card
            className={`mb-4 border-2 ${dataIntegrityStatus.valid ? "border-green-500/50 bg-green-50/50" : "border-red-500/50 bg-red-50/50"}`}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${dataIntegrityStatus.valid ? "text-green-600" : "text-red-600"}`} />
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${dataIntegrityStatus.valid ? "text-green-900" : "text-red-900"}`}
                  >
                    {dataIntegrityStatus.valid ? "Data Protected & Backed Up" : "Data Integrity Issues Detected"}
                  </p>
                  <p className={`text-xs ${dataIntegrityStatus.valid ? "text-green-700" : "text-red-700"}`}>
                    {dataIntegrityStatus.valid
                      ? "All records are secure and automatically backed up"
                      : `${dataIntegrityStatus.errors.length} issue(s) found`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-4 sm:mb-6 shadow-lg sm:shadow-xl border-2">
            <CardHeader className="bg-gradient-to-r from-brand/10 to-accent/10 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                Expense Report Form
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Fill in required fields (*) and add fuel expenses as applicable
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base sm:text-base font-semibold">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="text-base h-12 sm:h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverName" className="text-base sm:text-base font-semibold">
                    Driver Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="driverName"
                    name="driverName"
                    type="text"
                    placeholder="Enter driver name"
                    value={formData.driverName}
                    onChange={handleDriverNameChange}
                    className="text-base h-12 sm:h-12"
                    required
                  />
                  {formData.signatureTimestamp && (
                    <p className="text-xs text-muted-foreground">Signed at: {formData.signatureTimestamp}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truckRegistration" className="text-base sm:text-base font-semibold">
                    Truck Registration Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="truckRegistration"
                    name="truckRegistration"
                    type="text"
                    placeholder="e.g., AB12 CDE"
                    value={formData.truckRegistration}
                    onChange={handleInputChange}
                    className="text-base h-12 sm:h-12 uppercase"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-base sm:text-base font-semibold">
                    Mileage (km) <span className="text-muted-foreground text-sm">(optional)</span>
                  </Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    inputMode="decimal"
                    placeholder="Current mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="text-base h-12 sm:h-12"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="border-t pt-5 sm:pt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-brand">
                  <Camera className="w-5 h-5" />
                  Fuel Receipt <span className="text-muted-foreground text-sm font-normal">(optional)</span>
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptImage" className="text-base sm:text-base font-semibold">
                      Upload Receipt Photo
                    </Label>
                    <Input
                      ref={fileInputRef}
                      id="receiptImage"
                      name="receiptImage"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleReceiptUpload}
                      className="text-sm sm:text-base h-12 sm:h-12 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand/90"
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Take a clear photo of your fuel receipt (max 5MB, optional)
                    </p>
                  </div>

                  {receiptPreview && (
                    <div className="relative border-2 border-border rounded-lg p-3 sm:p-4 bg-muted/50">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 h-9 w-9 sm:h-10 sm:w-10"
                        onClick={removeReceiptImage}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <div className="flex justify-center">
                        <img
                          src={receiptPreview || "/placeholder.svg"}
                          alt="Receipt preview"
                          className="max-w-full max-h-64 sm:max-h-96 rounded-lg object-contain"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2">
                        Receipt uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-5 sm:pt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-brand">
                  <Fuel className="w-5 h-5" />
                  Diesel <span className="text-muted-foreground text-sm font-normal">(fill if applicable)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dieselAdded" className="text-base sm:text-base font-semibold">
                      Litres Added
                    </Label>
                    <Input
                      id="dieselAdded"
                      name="dieselAdded"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.dieselAdded}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dieselPrice" className="text-base sm:text-base font-semibold">
                      Price per Litre (£)
                    </Label>
                    <Input
                      id="dieselPrice"
                      name="dieselPrice"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.dieselPrice}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base sm:text-base font-semibold">Total Cost</Label>
                    <div className="h-12 sm:h-12 flex items-center px-4 bg-muted rounded-md text-lg font-bold text-brand">
                      £{totals.dieselTotal}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-5 sm:pt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-accent-foreground">
                  <Droplet className="w-5 h-5" />
                  AdBlue <span className="text-muted-foreground text-sm font-normal">(fill if applicable)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adblueAdded" className="text-base sm:text-base font-semibold">
                      Litres Added
                    </Label>
                    <Input
                      id="adblueAdded"
                      name="adblueAdded"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.adblueAdded}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adbluePrice" className="text-base sm:text-base font-semibold">
                      Price per Litre (£)
                    </Label>
                    <Input
                      id="adbluePrice"
                      name="adbluePrice"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.adbluePrice}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base sm:text-base font-semibold">Total Cost</Label>
                    <div className="h-12 sm:h-12 flex items-center px-4 bg-muted rounded-md text-lg font-bold text-accent-foreground">
                      £{totals.adblueTotal}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-5 sm:pt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Other Expenses <span className="text-muted-foreground text-sm font-normal">(optional)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otherExpenses" className="text-base sm:text-base font-semibold">
                      Description
                    </Label>
                    <Input
                      id="otherExpenses"
                      name="otherExpenses"
                      type="text"
                      placeholder="e.g., Parking, Tolls, etc."
                      value={formData.otherExpenses}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherExpensesCost" className="text-base sm:text-base font-semibold">
                      Cost (£)
                    </Label>
                    <Input
                      id="otherExpensesCost"
                      name="otherExpensesCost"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.otherExpensesCost}
                      onChange={handleInputChange}
                      className="text-base h-12 sm:h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-5 sm:pt-6">
                <div className="bg-gradient-to-r from-brand/20 to-accent/20 p-4 sm:p-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <span className="text-xl sm:text-2xl font-bold">Grand Total:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-brand">£{totals.grandTotal}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:gap-4 px-1">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 sm:h-14 text-base sm:text-lg font-semibold shadow-lg active:scale-[0.98] transition-transform"
              disabled={isSubmitting}
            >
              <Download className="w-5 h-5 mr-2" />
              {isSubmitting ? "Generating PDF..." : "Generate & Download PDF"}
            </Button>
          </div>

          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 px-4 leading-relaxed">
            The PDF will be automatically downloaded to your device. All data is saved and backed up automatically for
            monthly batch submission.
          </p>
        </form>
      </div>
      <Toaster />
    </div>
  )
}
