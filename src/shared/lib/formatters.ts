export const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString("es-CO")}`;

export const formatOrderShortId = (orderId: string) =>
  orderId.split("_").at(-1)?.toUpperCase() ?? orderId;
