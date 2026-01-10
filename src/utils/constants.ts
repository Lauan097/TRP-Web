export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://a-p-i-trindade.discloud.app'
  : (process.env.NEXT_PUBLIC_API_URL || 'https://a-p-i-trindade.discloud.app');
