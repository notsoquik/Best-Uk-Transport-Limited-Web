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
}

const STORAGE_KEY = "fuel_records"

export function saveFuelRecord(record: Omit<FuelRecord, "id" | "createdAt">): FuelRecord {
  const records = getAllFuelRecords()
  const newRecord: FuelRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  records.push(newRecord)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
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
