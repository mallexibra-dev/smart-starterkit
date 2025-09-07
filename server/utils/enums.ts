const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]