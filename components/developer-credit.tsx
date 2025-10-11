"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink } from "lucide-react"

export function DeveloperCredit() {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null)

  const wallets = [
    {
      name: "Ethereum (ETH)",
      address: "0xcFB691775016E229F040Ee4F3C418035d8Ec3401",
    },
    {
      name: "Monero (XMR)",
      address: "48PnUkPPDtBa12LXNzi8pEj2k61jDEhVkMZuZzabubjN9dF5m1eicveGjvnr1R7vNwhsRmb9HPYtSQYrjdmPFY2374yp1i8",
    },
  ]

  const copyToClipboard = (address: string, name: string) => {
    navigator.clipboard.writeText(address)
    setCopiedWallet(name)
    setTimeout(() => setCopiedWallet(null), 2000)
  }

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="px-4 py-3 text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <a
              href="https://houndslight.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Zachary T.
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-[10px] sm:text-xs">Support via crypto:</span>
            <div className="flex flex-wrap gap-1">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-[10px] font-mono"
                  onClick={() => copyToClipboard(wallet.address, wallet.name)}
                  title={`Click to copy ${wallet.name} address`}
                >
                  {copiedWallet === wallet.name ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      {wallet.name}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
