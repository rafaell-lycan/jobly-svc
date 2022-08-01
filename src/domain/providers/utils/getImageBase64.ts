import { encode } from 'node-base64-image'

export const getImageBase64 = async (imageUrl: string): Promise<string> => {
  const mediaType = 'image/png'
  const charset = 'utf-8'
  const image = await encode(imageUrl, { string: true })

  return `data:${mediaType};charset=${charset};base64,${image}`
}
