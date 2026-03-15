import { UserButton } from '@clerk/nextjs'
import { Bell } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
