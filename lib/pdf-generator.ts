import jsPDF from "jspdf"

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

interface Totals {
  dieselTotal: string
  adblueTotal: string
  otherTotal: string
  grandTotal: string
}

export async function generatePDF(formData: FormData, totals: Totals) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = 20

  // Header
  pdf.setFillColor(13, 71, 161)
  pdf.rect(0, 0, pageWidth, 40, "F")

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont("helvetica", "bold")
  pdf.text("Best UK Transport Limited", pageWidth / 2, 18, { align: "center" })

  pdf.setFontSize(14)
  pdf.setFont("helvetica", "normal")
  pdf.text("Fuel Intake & Spendings Report", pageWidth / 2, 30, { align: "center" })

  yPosition = 55

  // Reset text color
  pdf.setTextColor(0, 0, 0)

  // Date and Driver Information
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("Report Details", margin, yPosition)
  yPosition += 8

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(11)

  const addField = (label: string, value: string) => {
    pdf.setFont("helvetica", "bold")
    pdf.text(`${label}:`, margin, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.text(value, margin + 60, yPosition)
    yPosition += 7
  }

  addField("Date", formData.date)
  addField("Driver Name", formData.driverName)
  addField("Truck Registration", formData.truckRegistration.toUpperCase())
  addField("Mileage", formData.mileage ? `${formData.mileage} km` : "N/A")

  yPosition += 5

  if (formData.receiptImage) {
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("Fuel Receipt", margin + 2, yPosition + 6)
    yPosition += 13

    try {
      const img = new Image()
      img.src = formData.receiptImage

      await new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })

      const maxWidth = pageWidth - 2 * margin
      const maxHeight = 100

      let imgWidth = maxWidth
      let imgHeight = maxHeight

      // Preserve aspect ratio
      if (img.width && img.height) {
        const aspectRatio = img.width / img.height
        if (aspectRatio > maxWidth / maxHeight) {
          imgHeight = maxWidth / aspectRatio
        } else {
          imgWidth = maxHeight * aspectRatio
        }
      }

      // Center the image horizontally
      const xOffset = margin + (maxWidth - imgWidth) / 2

      pdf.addImage(formData.receiptImage, "JPEG", xOffset, yPosition, imgWidth, imgHeight, undefined, "FAST")
      yPosition += imgHeight + 10
    } catch (error) {
      console.error("[v0] Error adding receipt image to PDF:", error)
      pdf.setFont("helvetica", "italic")
      pdf.setFontSize(10)
      pdf.text("Receipt image could not be loaded", margin, yPosition)
      yPosition += 10
    }
  }

  // Check if we need a new page before continuing
  if (yPosition > pageHeight - 120) {
    pdf.addPage()
    yPosition = 20
  }

  // Diesel Section
  if (formData.dieselAdded || formData.dieselPrice) {
    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("Diesel", margin + 2, yPosition + 6)
    yPosition += 13

    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    addField("Litres Added", formData.dieselAdded ? `${formData.dieselAdded} L` : "0.00 L")
    addField("Price per Litre", formData.dieselPrice ? `£${formData.dieselPrice}` : "£0.00")

    pdf.setFont("helvetica", "bold")
    pdf.text("Total Cost:", margin, yPosition)
    pdf.setTextColor(13, 71, 161)
    pdf.text(`£${totals.dieselTotal}`, margin + 60, yPosition)
    pdf.setTextColor(0, 0, 0)
    yPosition += 10
  }

  // AdBlue Section
  if (formData.adblueAdded || formData.adbluePrice) {
    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("AdBlue", margin + 2, yPosition + 6)
    yPosition += 13

    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    addField("Litres Added", formData.adblueAdded ? `${formData.adblueAdded} L` : "0.00 L")
    addField("Price per Litre", formData.adbluePrice ? `£${formData.adbluePrice}` : "£0.00")

    pdf.setFont("helvetica", "bold")
    pdf.text("Total Cost:", margin, yPosition)
    pdf.setTextColor(13, 71, 161)
    pdf.text(`£${totals.adblueTotal}`, margin + 60, yPosition)
    pdf.setTextColor(0, 0, 0)
    yPosition += 10
  }

  // Other Expenses Section
  if (formData.otherExpenses || formData.otherExpensesCost) {
    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "F")
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("Other Expenses", margin + 2, yPosition + 6)
    yPosition += 13

    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    addField("Description", formData.otherExpenses || "N/A")

    pdf.setFont("helvetica", "bold")
    pdf.text("Cost:", margin, yPosition)
    pdf.setTextColor(13, 71, 161)
    pdf.text(`£${totals.otherTotal}`, margin + 60, yPosition)
    pdf.setTextColor(0, 0, 0)
    yPosition += 10
  }

  // Check if we need a new page for grand total and signature
  if (yPosition > pageHeight - 80) {
    pdf.addPage()
    yPosition = 20
  }

  // Grand Total
  yPosition += 5
  pdf.setFillColor(13, 71, 161)
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, "F")
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.text("GRAND TOTAL:", margin + 5, yPosition + 10)
  pdf.text(`£${totals.grandTotal}`, pageWidth - margin - 5, yPosition + 10, { align: "right" })

  yPosition += 25
  pdf.setTextColor(0, 0, 0)

  // Signature Section
  if (formData.signature && formData.signatureTimestamp) {
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("Driver Signature", margin, yPosition)
    yPosition += 10

    // Display signature as text
    pdf.setFont("helvetica", "italic")
    pdf.setFontSize(14)
    pdf.text(formData.signature, margin, yPosition)
    yPosition += 10

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.text(`Signed by: ${formData.driverName}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Timestamp: ${formData.signatureTimestamp}`, margin, yPosition)
  }

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15
  pdf.setFontSize(9)
  pdf.setTextColor(128, 128, 128)
  pdf.text(
    "This document is generated electronically and is valid without a physical signature.",
    pageWidth / 2,
    footerY,
    { align: "center" },
  )

  // Generate filename with date and driver name
  const filename = `Fuel_Report_${formData.date}_${formData.driverName.replace(/\s+/g, "_")}.pdf`

  // Save the PDF
  pdf.save(filename)
}
