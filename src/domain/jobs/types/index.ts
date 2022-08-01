const FULL_TIME = 'full-time'
const PART_TIME = 'part-time'
const CONTRACT = 'contract'
const FREELANCE = 'freelance'
const INTERNSHIP = 'internship'
const OTHER = 'other'

export const jobTypes = [
  FULL_TIME,
  PART_TIME,
  CONTRACT,
  FREELANCE,
  INTERNSHIP,
  OTHER,
] as const

export type JobType = typeof jobTypes[number]
