export const findProp = (
  obj: any,
  key: string,
  value: any,
  parents: any[] = []
): any => {
  if (parents.includes(obj)) return null
  if (obj && obj[key] === value) return { obj, parents }
  const childProps =
    (obj &&
      Object.values(obj).flatMap((val) =>
        findProp(val, key, value, [obj, ...parents])
      )) ||
    []
  return childProps.find((d: any) => !!d)
}
