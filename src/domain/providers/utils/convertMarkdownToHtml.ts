import MarkdownIt from 'markdown-it'

export const convertMarkdownToHtml = (markdown: string): string => {
  const options = {
    html: true,
  }
  return MarkdownIt(options).render(markdown)
}
