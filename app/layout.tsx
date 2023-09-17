import './globals.css'
import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {Inter, Open_Sans} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'
import {ThemeProvider} from '@/components/providers/theme-provider'
import {Analytics} from "@vercel/analytics/react"

const font = Open_Sans({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Team Chat Application',
    description: 'Generated by create next app',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="zh_CN" suppressHydrationWarning>
            <body className={cn(
                font.className,
                "bg-[#f5f5f5]",
                "dark:bg-[#313338]"
            )}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={true}
                storageKey='discord-theme'
            >
                {children}
            </ThemeProvider>
            <Analytics/>
            </body>
            </html>
        </ClerkProvider>

    )
}
