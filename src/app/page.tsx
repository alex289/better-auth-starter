import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { ArrowRight } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b px-8 backdrop-blur">
        <div className="flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Auth Kit</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Complete Authentication Solution
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Secure, flexible, and feature-rich authentication for your
                  application
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline">Documentation</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="bg-primary text-primary-foreground inline-block rounded-lg px-3 py-1 text-sm">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Everything you need for authentication
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our authentication starter kit provides all the essential
                  features to secure your application and manage users
                  effectively.
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Email & Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Traditional authentication with secure password handling.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Two-Factor Auth</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security with 2FA.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <rect width="16" height="13" x="4" y="5" rx="2" />
                        <path d="m22 5-10.5 7L1 5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Email OTP</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      One-time password sent via email for verification.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                        <path d="M9.1 12a2.1 2.1 0 0 0 0 3" />
                        <path d="M9.1 9a5.1 5.1 0 0 0 0 6" />
                        <path d="M14.9 12a2.1 2.1 0 0 1 0 3" />
                        <path d="M14.9 9a5.1 5.1 0 0 1 0 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Passkeys</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Passwordless authentication using biometrics or security
                      keys.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Organizations</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Multi-tenant support with team management.
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5">
                        <path d="M21 2H3v16h5v4l4-4h4l5-5V2zm-10 9V7m5 4V7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">API Keys</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generate and manage API keys for programmatic access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t px-8 py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            © 2025 Auth Kit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
