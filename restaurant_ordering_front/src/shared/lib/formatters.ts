export const formatCurrency = (amount: number) => {
  const hasMinorFraction = Math.abs(amount) % 100 !== 0;

  return `$${new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: hasMinorFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount / 100)}`;
};

export const formatOrderShortId = (orderId: string) =>
  orderId.split("_").at(-1)?.toUpperCase() ?? orderId;
