import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryProvider } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fractional First - Public Profiles",
  description: "Professional fractional executive profiles",
  other: {
    "google-site-verification": "4YExotnMS2PD6Nl2jyDsYeJ_hmpiz-YBd302CkZexgM",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
