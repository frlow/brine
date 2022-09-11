export const DocsNav = ({ links }: { links: string[] }) => {
  return (
    <>
      {links
        .sort((a, b) => (a.localeCompare(b) ? 1 : -1))
        .map((prop, index) => (
          <a key={index} href={`#${prop}`}>
            {prop}
          </a>
        ))}
    </>
  )
}
