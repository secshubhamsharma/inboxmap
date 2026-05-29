const CO2_PER_EMAIL = {
  Newsletter:   4.0,
  Promotion:    2.0,
  Notification: 0.5,
  Social:       1.0,
  Other:        1.5,
}

const EQUIVALENTS = [
  { label: 'km driven',         factor: 0.21,   unit: 'km',  icon: '🚗' },
  { label: 'plastic bottles',   factor: 0.083,  unit: '',    icon: '🧴' },
  { label: 'hours of streaming',factor: 0.036,  unit: 'h',   icon: '📺' },
  { label: 'cups of coffee',    factor: 0.21,   unit: '',    icon: '☕' },
]

export function calculateCarbon(senders) {
  let totalGrams = 0
  let ghostGrams = 0
  const byCategory = {}

  for (const sender of senders) {
    const gPerEmail = CO2_PER_EMAIL[sender.category] ?? 1.5
    const senderTotal = sender.count * gPerEmail
    totalGrams += senderTotal
    byCategory[sender.category] = (byCategory[sender.category] || 0) + senderTotal

    if (sender.status === 'ghost' || sender.status === 'dormant') {
      ghostGrams += senderTotal
    }
  }

  const totalKg   = totalGrams / 1000
  const ghostKg   = ghostGrams / 1000
  const savingsKg = ghostKg

  const equivalents = EQUIVALENTS.map((eq) => ({
    ...eq,
    value: +(totalKg / eq.factor).toFixed(1),
    savingsValue: +(savingsKg / eq.factor).toFixed(1),
  }))

  return {
    totalGrams,
    totalKg: +totalKg.toFixed(2),
    ghostKg: +ghostKg.toFixed(2),
    savingsKg: +savingsKg.toFixed(2),
    savingsPct: totalGrams > 0 ? Math.round((ghostGrams / totalGrams) * 100) : 0,
    byCategory,
    equivalents,
  }
}
