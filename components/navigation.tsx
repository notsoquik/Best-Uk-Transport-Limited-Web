"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 sm:relative sm:border-0 sm:shadow-none sm:bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3">
          <Link href="/" className="flex-1">
            <Button
              variant={pathname === "/" ? "default" : "outline"}
              className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold"
            >
              <FileText className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
              New Report
            </Button>
          </Link>
          <Link href="/reports" className="flex-1">
            <Button
              variant={pathname === "/reports" ? "default" : "outline"}
              className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold"
            >
              <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
