import Link from 'next/link';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/get-started" className="mr-6 flex items-center space-x-2">
          <span className="font-black text-2xl tracking-tighter text-primary">
            Walpap
          </span>
        </Link>
        <nav className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="ghost">
              <Link href="/">
                  Home
              </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/login">
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
