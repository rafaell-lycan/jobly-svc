export const REMOTIVE_PROVIDER = 'remotive'

export interface Remotive {
  // Metadata
  id: number
  url: string
  publication_date: string

  // Job details
  title: string
  description: string
  category: string
  tags: string[]
  job_type: string
  candidate_required_location: string
  salary: string

  // Company details
  company_name: string
  company_logo: string
  company_logo_url: string
}
