export type CustomerMovement = {
  id: string
  customerId: string
  type: "debt" | "payment"
  amount: number
  description: string
  createdAt: number
}