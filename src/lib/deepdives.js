const rawDeepDives = import.meta.glob('../content/deepdives/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }

  const [, frontmatter, content] = match
  const data = {}
  for (const line of frontmatter.split('\n')) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue
    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  }
  return { data, content: content.trim() }
}

export const DEEP_DIVES = Object.entries(rawDeepDives).map(([path, raw]) => {
  const slug = path.split('/').pop().replace(/\.md$/, '')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: data.title ?? slug,
    company: data.company ?? '',
    content,
  }
})

export function getDeepDiveBySlug(slug) {
  return DEEP_DIVES.find((deepDive) => deepDive.slug === slug)
}
