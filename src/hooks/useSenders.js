import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'

export function useSenders({ category = null } = {}) {
  const { senders, settings } = useApp()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState(category || 'All')
  const [sortBy, setSortBy] = useState('count')
  const [page, setPage] = useState(1)
  const pageSize = 50

  const filtered = useMemo(() => {
    let list = senders

    if (category) {
      list = list.filter((s) => s.category === category)
    } else if (filterCategory !== 'All') {
      list = list.filter((s) => s.category === filterCategory)
    }

    if (settings.minCount > 1) {
      list = list.filter((s) => s.count >= settings.minCount)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      )
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'lastDate') return new Date(b.lastDate) - new Date(a.lastDate)
      if (sortBy === 'firstDate') return new Date(a.firstDate) - new Date(b.firstDate)
      return 0
    })

    return list
  }, [senders, category, filterCategory, settings.minCount, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch(val) {
    setSearch(val)
    setPage(1)
  }

  function handleFilterCategory(val) {
    setFilterCategory(val)
    setPage(1)
  }

  return {
    senders: paginated,
    allFiltered: filtered,
    total: filtered.length,
    search,
    setSearch: handleSearch,
    filterCategory,
    setFilterCategory: handleFilterCategory,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageSize,
  }
}
