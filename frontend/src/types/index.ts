export interface User {
  id: number
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  createdAt: string
}

export interface UserProfile extends User {
  gamesCount: number
  totalHours: number
  averageRating: number
  completedGames: number
  recentReviews?: Review[]
}

export interface Game {
  id?: number
  externalId?: string
  title: string
  coverUrl?: string
  genres?: string
  platforms?: string
  releaseDate?: string
}

export type GameStatus = 'playing' | 'completed' | 'dropped' | 'wishlist'

export interface UserGame {
  id: number
  game: Game
  status: GameStatus
  rating: number
  hoursPlayed: number
  review?: string
  completedAt?: string
  createdAt: string
}

export interface Review {
  id: number
  user: User
  game: Game
  rating: number
  content: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface GameSearchResult {
  id?: number
  externalId?: string
  title: string
  coverUrl?: string
  genres?: string
  platforms?: string
  releaseDate?: string
}

export interface GameStatusUpdate {
  status: GameStatus
  rating?: number
  hoursPlayed?: number
  review?: string
}

export interface GameDetail {
  title: string
  coverUrl?: string
  releaseDate?: string
  genres?: string
  platforms?: string
  description?: string
  rawgRating?: number
  metacritic?: number
  externalId?: string
}

export interface GamePrice {
  title: string
  cheapestPrice: number | null
  storeName: string | null
  dealUrl: string | null
}
