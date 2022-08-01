import slugify from 'slugify'

const options: Parameters<typeof slugify>[1] = {
  lower: true,
  strict: true,
}

slugify.extend({ '/': '-' })

export const generateSlug = (
  companyName: string,
  title: string,
  hash: string
): string => {
  const slug = slugify(`${companyName} ${title}`, options)

  return `${slug}-${hash}`
}
