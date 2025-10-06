export interface FuelRecord {
  id: string
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
  dieselTotal: number
  adblueTotal: number
  otherTotal: number
  grandTotal: number
  createdAt: string
  submittedInBatch?: boolean
  batchSubmissionDate?: string
}

const STORAGE_KEY = "fuel_records"
const BACKUP_KEY = "fuel_records_backup"
const BATCH_SUBMISSION_KEY = "batch_submissions"

export interface BatchSubmission {
  id: string
  month: string
  year: number
  monthNumber: number
  records: FuelRecord[]
  totalRecords: number
  totalSpending: number
  submittedAt: string | null
  status: "pending" | "submitted"
  createdAt: string
}

export function validateStorageIntegrity(): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return true
    const records = JSON.parse(data)
    return Array.isArray(records)
  } catch {
    return false
  }
}

export function createBackup(): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      localStorage.setItem(BACKUP_KEY, data)
      localStorage.setItem(`${BACKUP_KEY}_timestamp`, new Date().toISOString())
    }
  } catch (error) {
    console.error("[v0] Backup creation failed:", error)
  }
}

// Backup data to prevent loss
export function backupData(): void {
  const records = getAllFuelRecords()
  const backup = {
    records,
    timestamp: new Date().toISOString(),
    version: "1.0",
  }
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup))
}

// Restore from backup
export function restoreFromBackup(): FuelRecord[] | null {
  const backupData = localStorage.getItem(BACKUP_KEY)
  if (!backupData) return null
  try {
    const backup = JSON.parse(backupData)
    return backup.records
  } catch {
    return null
  }
}

// Data integrity check
export function validateDataIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const records = getAllFuelRecords()

  records.forEach((record, index) => {
    if (!record.id) errors.push(`Record ${index + 1}: Missing ID`)
    if (!record.driverName) errors.push(`Record ${index + 1}: Missing driver name`)
    if (!record.truckRegistration) errors.push(`Record ${index + 1}: Missing truck registration`)
    if (!record.date) errors.push(`Record ${index + 1}: Missing date`)
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function saveFuelRecord(record: Omit<FuelRecord, "id" | "createdAt">): FuelRecord {
  createBackup()

  const records = getAllFuelRecords()
  const newRecord: FuelRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  records.push(newRecord)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (error) {
    console.error("[v0] Storage save failed:", error)
    throw new Error("Failed to save record. Storage may be full.")
  }

  return newRecord
}

export function getAllFuelRecords(): FuelRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getFuelRecordsByDate(date: string): FuelRecord[] {
  const records = getAllFuelRecords()
  return records.filter((record) => record.date === date)
}

export function getFuelRecordsByMonth(year: number, month: number): FuelRecord[] {
  const records = getAllFuelRecords()
  return records.filter((record) => {
    const recordDate = new Date(record.date)
    return recordDate.getFullYear() === year && recordDate.getMonth() === month
  })
}

export function deleteFuelRecord(id: string): void {
  const records = getAllFuelRecords()
  const filtered = records.filter((record) => record.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function calculateMonthlyStats(records: FuelRecord[]) {
  const totalRecords = records.length
  const totalDiesel = records.reduce((sum, r) => sum + Number.parseFloat(r.dieselAdded || "0"), 0)
  const totalAdblue = records.reduce((sum, r) => sum + Number.parseFloat(r.adblueAdded || "0"), 0)
  const totalDieselCost = records.reduce((sum, r) => sum + r.dieselTotal, 0)
  const totalAdblueCost = records.reduce((sum, r) => sum + r.adblueTotal, 0)
  const totalOtherCost = records.reduce((sum, r) => sum + r.otherTotal, 0)
  const totalSpending = records.reduce((sum, r) => sum + r.grandTotal, 0)

  const avgDieselPrice =
    totalDiesel > 0
      ? records.reduce((sum, r) => sum + Number.parseFloat(r.dieselPrice || "0"), 0) /
        records.filter((r) => r.dieselPrice).length
      : 0

  const avgAdbluePrice =
    totalAdblue > 0
      ? records.reduce((sum, r) => sum + Number.parseFloat(r.adbluePrice || "0"), 0) /
        records.filter((r) => r.adbluePrice).length
      : 0

  // Group by driver
  const byDriver = records.reduce(
    (acc, record) => {
      if (!acc[record.driverName]) {
        acc[record.driverName] = { count: 0, total: 0 }
      }
      acc[record.driverName].count++
      acc[record.driverName].total += record.grandTotal
      return acc
    },
    {} as Record<string, { count: number; total: number }>,
  )

  // Group by truck
  const byTruck = records.reduce(
    (acc, record) => {
      if (!acc[record.truckRegistration]) {
        acc[record.truckRegistration] = { count: 0, total: 0 }
      }
      acc[record.truckRegistration].count++
      acc[record.truckRegistration].total += record.grandTotal
      return acc
    },
    {} as Record<string, { count: number; total: number }>,
  )

  return {
    totalRecords,
    totalDiesel: totalDiesel.toFixed(2),
    totalAdblue: totalAdblue.toFixed(2),
    totalDieselCost: totalDieselCost.toFixed(2),
    totalAdblueCost: totalAdblueCost.toFixed(2),
    totalOtherCost: totalOtherCost.toFixed(2),
    totalSpending: totalSpending.toFixed(2),
    avgDieselPrice: avgDieselPrice.toFixed(2),
    avgAdbluePrice: avgAdbluePrice.toFixed(2),
    byDriver,
    byTruck,
  }
}

export function getUnsubmittedRecordsByMonth(year: number, month: number): FuelRecord[] {
  const records = getFuelRecordsByMonth(year, month)
  return records.filter((record) => !record.submittedInBatch)
}

export function markRecordsAsSubmitted(recordIds: string[]): void {
  createBackup()

  const records = getAllFuelRecords()
  const submissionDate = new Date().toISOString()

  const updatedRecords = records.map((record) => {
    if (recordIds.includes(record.id)) {
      return {
        ...record,
        submittedInBatch: true,
        batchSubmissionDate: submissionDate,
      }
    }
    return record
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))
}

export function getStorageStats() {
  const records = getAllFuelRecords()
  const totalRecords = records.length
  const submittedRecords = records.filter((r) => r.submittedInBatch).length
  const pendingRecords = totalRecords - submittedRecords

  const storageUsed = new Blob([JSON.stringify(records)]).size
  const storageUsedMB = (storageUsed / (1024 * 1024)).toFixed(2)

  return {
    totalRecords,
    submittedRecords,
    pendingRecords,
    storageUsedMB,
  }
}

// Export data as JSON
export function exportDataAsJSON(): string {
  const records = getAllFuelRecords()
  return JSON.stringify(records, null, 2)
}

// Export data as CSV
export function exportDataAsCSV(): string {
  const records = getAllFuelRecords()
  if (records.length === 0) return ""

  const headers = [
    "Date",
    "Driver Name",
    "Truck Registration",
    "Mileage (km)",
    "Diesel (L)",
    "Diesel Price (£)",
    "Diesel Total (£)",
    "AdBlue (L)",
    "AdBlue Price (£)",
    "AdBlue Total (£)",
    "Other Expenses",
    "Other Cost (£)",
    "Grand Total (£)",
    "Signature Timestamp",
  ]

  const rows = records.map((record) => [
    record.date,
    record.driverName,
    record.truckRegistration,
    record.mileage || "N/A",
    record.dieselAdded || "0",
    record.dieselPrice || "0",
    record.dieselTotal.toFixed(2),
    record.adblueAdded || "0",
    record.adbluePrice || "0",
    record.adblueTotal.toFixed(2),
    record.otherExpenses || "N/A",
    record.otherTotal.toFixed(2),
    record.grandTotal.toFixed(2),
    record.signatureTimestamp,
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}

// Get or create batch submission for a month
export function getOrCreateBatchSubmission(year: number, month: number): BatchSubmission {
  const batches = getAllBatchSubmissions()
  const existing = batches.find((b) => b.year === year && b.monthNumber === month)

  if (existing) return existing

  const records = getFuelRecordsByMonth(year, month)
  const totalSpending = records.reduce((sum, r) => sum + r.grandTotal, 0)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const newBatch: BatchSubmission = {
    id: crypto.randomUUID(),
    month: monthNames[month],
    year,
    monthNumber: month,
    records,
    totalRecords: records.length,
    totalSpending,
    submittedAt: null,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  batches.push(newBatch)
  localStorage.setItem(BATCH_SUBMISSION_KEY, JSON.stringify(batches))
  return newBatch
}

// Get all batch submissions
export function getAllBatchSubmissions(): BatchSubmission[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(BATCH_SUBMISSION_KEY)
  return data ? JSON.parse(data) : []
}

// Submit a batch
export function submitBatch(batchId: string): void {
  const batches = getAllBatchSubmissions()
  const batch = batches.find((b) => b.id === batchId)

  if (batch) {
    batch.status = "submitted"
    batch.submittedAt = new Date().toISOString()
    localStorage.setItem(BATCH_SUBMISSION_KEY, JSON.stringify(batches))
    backupData() // Backup after submission
  }
}

// Delete a batch submission
export function deleteBatchSubmission(batchId: string): void {
  const batches = getAllBatchSubmissions()
  const filtered = batches.filter((b) => b.id !== batchId)
  localStorage.setItem(BATCH_SUBMISSION_KEY, JSON.stringify(filtered))
}
