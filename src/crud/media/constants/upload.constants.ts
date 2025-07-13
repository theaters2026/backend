export const UPLOAD_CONSTANTS = {
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/webm',
    'video/x-msvideo',
  ],
  ALLOWED_EXTENSIONS: ['.jpeg', '.jpg', '.png', '.mp4', '.webm', '.avi'],
  IMAGE_EXTENSIONS: ['.jpeg', '.jpg', '.png'],
  VIDEO_EXTENSIONS: ['.mp4', '.webm', '.avi'],
  SUBFOLDERS: {
    PICTURES: 'pictures',
    VIDEOS: 'videos',
    OTHER: 'other',
  },
} as const

export type AllowedMimeType =
  (typeof UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES)[number]
export type AllowedExtension =
  (typeof UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS)[number]
export type ImageExtension = (typeof UPLOAD_CONSTANTS.IMAGE_EXTENSIONS)[number]
export type VideoExtension = (typeof UPLOAD_CONSTANTS.VIDEO_EXTENSIONS)[number]
