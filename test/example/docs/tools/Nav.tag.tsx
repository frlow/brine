import React from 'react'

export const DocsNav = ({ links }: { links: string[] }) => {
  const groupedLinks = links.reduce((acc, cur) => {
    const parts = cur.split('--')
    const category = parts.length === 2 ? parts[0] : ''
    const root = parts.length === 1
    const name = parts.length === 2 ? parts[1] : parts[0]
    if (!acc[category]) acc[category] = []
    acc[category].push({ name, link: `#${cur}`, root })
    return acc
  }, {} as { [i: string]: { name: string; link: string; root: boolean }[] })
  return (
    <>
      {Object.entries(groupedLinks).map(([groupKey, groupValue]) => (
        <div
          key={groupKey}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div>{groupKey}</div>
          {groupValue.map((group) => (
            <a
              key={group.name}
              href={group.link}
              style={{
                marginLeft: group.root ? '' : '0.4rem',
                marginBottom: '3px',
              }}
            >
              {group.name.replace('_', '')}
            </a>
          ))}
        </div>
      ))}
    </>
  )
}
