import fetch from 'cross-fetch'

type CompanyData = {
  name: string
  domain: string
  logo: string
}

const CLEARBIT_API_URL =
  'https://autocomplete.clearbit.com/v1/companies/suggest'

export const getCompanyData = async (
  companyName: string
): Promise<CompanyData | null> => {
  const response = await fetch(`${CLEARBIT_API_URL}?query=${companyName}`)
  const data = (await response.json()) as CompanyData[]
  const result = data.filter(({ name }) => name === companyName)

  return result.length === 1 ? result[0] : null
}
