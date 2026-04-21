export type Product = {
  id: string
  name: string
  variant: string
  category: string // 👈 ahora dinámico
  stock: number
  salePrice: number
  costPrice: number
  imageUrl: string
  createdAt?: number
}