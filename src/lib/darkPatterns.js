export const DARK_PATTERN_TYPES = [
  {
    id: 'urgency',
    name: 'False Urgency',
    icon: '⏰',
    desc: 'Creates artificial time pressure to force immediate action',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    regex: /\b(last chance|expires (tonight|soon|today)|ending (soon|today|tonight)|act now|limited time|hurry|today only|\d+ hours? (left|remaining)|don.?t miss|final (hours?|call)|time.?s (running|almost) out|offer ends|sale ends)\b/i,
  },
  {
    id: 'fake_reply',
    name: 'Fake Reply',
    icon: '↩️',
    desc: 'Disguises mass marketing emails as personal replies to boost open rates',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    regex: /^(re|fw|fwd)\s*:/i,
  },
  {
    id: 'personalization_fail',
    name: 'Broken Personalization',
    icon: '🏷️',
    desc: 'Merge tag left unreplaced — reveals mass mailing system behind a "personal" email',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    regex: /\[first.?name\]|\[name\]|\[fname\]|\[last.?name\]|\{\{first|\{\{name|#firstname#|%firstname%/i,
  },
  {
    id: 'scarcity',
    name: 'Fake Scarcity',
    icon: '📉',
    desc: 'Claims limited availability to pressure a decision',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    regex: /\b(only \d+ (left|remaining|available)|selling fast|almost (gone|sold out)|low stock|limited (supply|availability|stock|quantity|spots?)|running out|nearly gone)\b/i,
  },
  {
    id: 'fear',
    name: 'Fear Tactics',
    icon: '⚠️',
    desc: 'Uses anxiety and threat of loss to force engagement',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    regex: /\b(your account (will be|has been|may be|is at risk)|security (alert|notice|warning|breach)|unusual (activity|sign.?in|login)|verify your (account|identity|email)|suspicious (activity|login)|unauthorized)\b/i,
  },
  {
    id: 'clickbait',
    name: 'Clickbait',
    icon: '🎣',
    desc: 'Deliberately withholds information to force an open',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    regex: /\b(you won.?t believe|this is (crazy|insane|wild)|shocking|mind.?blowing|game.?changer|everything changed|i can.?t believe|nobody talks about|they don.?t want you to know)\b/i,
  },
  {
    id: 'all_caps',
    name: 'Aggressive Caps',
    icon: '📢',
    desc: 'Uses ALL CAPS excessively to shout for attention',
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
    test: (s) => (s.match(/\b[A-Z]{4,}\b/g) || []).length >= 2,
  },
  {
    id: 'emoji_spam',
    name: 'Emoji Overload',
    icon: '🤯',
    desc: 'Packs 3+ emojis into a subject line to stand out artificially',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    test: (s) => {
      const emojiRx = /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/gu
      return (s.match(emojiRx) || []).length >= 3
    },
  },
]

function subjectMatchesPattern(subject, pattern) {
  if (pattern.test) return pattern.test(subject)
  if (pattern.regex) return pattern.regex.test(subject)
  return false
}

export function detectDarkPatterns(senders) {
  const results = {}

  for (const type of DARK_PATTERN_TYPES) {
    results[type.id] = { ...type, culprits: [] }
  }

  for (const sender of senders) {
    if (!sender.subjects?.length) continue
    const matchedSubjects = {}

    for (const { subject, date } of sender.subjects) {
      for (const type of DARK_PATTERN_TYPES) {
        if (subjectMatchesPattern(subject, type)) {
          if (!matchedSubjects[type.id]) matchedSubjects[type.id] = []
          matchedSubjects[type.id].push({ subject, date })
        }
      }
    }

    for (const [id, examples] of Object.entries(matchedSubjects)) {
      if (!results[id].culprits.find((c) => c.email === sender.email)) {
        results[id].culprits.push({
          email: sender.email,
          name: sender.name,
          count: examples.length,
          examples: examples.slice(0, 3).map((e) => e.subject),
        })
      }
    }
  }

  return Object.values(results)
    .filter((r) => r.culprits.length > 0)
    .sort((a, b) => b.culprits.length - a.culprits.length)
}

export function getTotalDarkPatternSenders(patterns) {
  const unique = new Set()
  patterns.forEach((p) => p.culprits.forEach((c) => unique.add(c.email)))
  return unique.size
}
