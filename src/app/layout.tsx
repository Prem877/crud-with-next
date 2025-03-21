import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"

import { fontVariables } from "@/lib/fonts"
// import { Analytics } from "@/components/analytics"
import { ThemeProvider } from "@/components/theme-provider/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { ActiveThemeProvider } from "@/components/theme-provider/active-theme"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const metadata: Metadata = {
  title: "Crud with Next.js",
  description: "Created by Hencework",
  keywords: ['Next.js', 'React', 'TypeScript', 'Crud', 'shadcn'],
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            {children}
            <Toaster />
            {/* <Analytics /> */}
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}