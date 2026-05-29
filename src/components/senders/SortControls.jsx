import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SortControls({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-36 h-9 bg-zinc-900 border-zinc-700 text-zinc-300 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800">
        <SelectItem value="count" className="text-zinc-300">Most emails</SelectItem>
        <SelectItem value="lastDate" className="text-zinc-300">Most recent</SelectItem>
        <SelectItem value="firstDate" className="text-zinc-300">Oldest first</SelectItem>
        <SelectItem value="name" className="text-zinc-300">Name A–Z</SelectItem>
      </SelectContent>
    </Select>
  )
}
