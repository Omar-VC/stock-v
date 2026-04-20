export type Product = {
  id: string
  name: string
  variant: string
  category: "lenceria" | "ropa_interior" | "perfume"
  stock: number
  salePrice: number
  costPrice: number
  imageUrl: string
  createdAt?: number
}