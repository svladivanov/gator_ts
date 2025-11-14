export function parseDuration(durationString: string): number | undefined {
  const regex = /^(\d+)(ms|s|m|h)$/
  const match = durationString.match(regex)
  if (!match) return

  if (match.length !== 3) return

  const value = parseInt(match[1], 10)
  const unit = match[2]
  switch (unit) {
    case 'ms':
      return value
    case 's':
      return value * 1000
    case 'm':
      return value * 60 * 1000
    case 'h':
      return value * 60 * 60 * 1000
    default:
      return
  }
}
