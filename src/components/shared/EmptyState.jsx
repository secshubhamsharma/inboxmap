import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-zinc-500">
      <Icon className="w-12 h-12 opacity-30" />
      <div className="text-center">
        <p className="text-zinc-300 font-medium">{title}</p>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
    </div>
  )
}
