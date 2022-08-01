import { customAlphabet } from 'nanoid'

const HASH_LENGTH = 6
const CUSTOM_ALPHABET = [
  '0123456789',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
].join('')

export const generateHash = (): string => {
  const nanoid = customAlphabet(CUSTOM_ALPHABET, HASH_LENGTH)

  return nanoid()
}
