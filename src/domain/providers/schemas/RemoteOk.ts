export const REMOTEOK_PROVIDER = 'remoteok'

export interface RemoteOk {
  // Metadata
  id: string
  slug: string
  epoch: number
  url: string
  date: string

  // Job details
  position: string
  description: string
  location: string
  apply_url: string
  tags: string[]

  // Company details
  company: string
  company_logo: string
  logo: string
}
