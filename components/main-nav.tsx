import Link from "next/link"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <svg
          width="100"
          height="30"
          viewBox="0 0 100 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto"
        >
          <path
            d="M0 15C0 6.716 6.716 0 15 0H85C93.284 0 100 6.716 100 15C100 23.284 93.284 30 85 30H15C6.716 30 0 23.284 0 15Z"
            className="fill-background dark:fill-background"
          />
          <path
            d="M22 8H38C40.2 8 42 9.8 42 12V18C42 20.2 40.2 22 38 22H22V8Z"
            className="fill-foreground dark:fill-foreground"
          />
          <path d="M48 8H64C66.2 8 68 9.8 68 12V18C68 20.2 66.2 22 64 22H48V8Z" fill="#D53F8C" />
          <path
            d="M74 8H90C92.2 8 94 9.8 94 12V18C94 20.2 92.2 22 90 22H74V8Z"
            className="fill-foreground dark:fill-foreground"
          />
          <path d="M28 14H36V16H28V14Z" className="fill-background dark:fill-background" />
          <path d="M54 14H62V16H54V14Z" className="fill-background dark:fill-background" />
          <path d="M80 14H88V16H80V14Z" className="fill-background dark:fill-background" />
        </svg>
        <span className="hidden text-xl font-bold sm:inline-block">Visitor Analytics</span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Dashboard
        </Link>
        <Link href="/logs" className="text-sm font-medium transition-colors hover:text-primary">
          Logs
        </Link>
        <Link
          href="/accounts"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Accounts
        </Link>
        <Link
          href="/reports"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Reports
        </Link>
      </nav>
    </div>
  )
}

