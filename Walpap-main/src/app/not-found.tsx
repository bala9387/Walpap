"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { usePathname } from "next/navigation"

export default function NotFound() {
    const pathname = usePathname()

  return (
    <div className="flex flex-1 items-center justify-center text-center p-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-primary/50 bg-card p-8 md:p-12 shadow-lg shadow-primary/10">
        <FrownIcon className="w-24 h-24 mb-4 text-primary mx-auto" />
        <h1 className="text-6xl md:text-7xl font-black text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page <code>{pathname}</code>. It might have been moved or deleted.
        </p>
        <Button asChild>
            <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go back to Homepage
            </Link>
        </Button>
      </div>
    </div>
  )
}

function FrownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    )
}