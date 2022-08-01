import sanitizeHtml, { IOptions } from 'sanitize-html'

const options: IOptions = {
  allowedAttributes: {
    a: [],
    img: [],
  },
  allowedSchemes: [],
  allowedSchemesAppliedToAttributes: [],
}

export const cleanHtmlContent = (html: string): string => {
  return sanitizeHtml(html, options)
}
