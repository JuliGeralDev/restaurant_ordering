export const maskEmail = (email: string) => {
  const [user = "", domain = "***"] = email.split("@");
  if (!user) {
    return `***@${domain}`;
  }

  return `${user[0]}***@${domain}`;
};

export const maskPhone = (phone: string) => {
  const digitsOnly = phone.replace(/\D/g, "");
  const visibleSuffix = digitsOnly.slice(-4);

  if (!visibleSuffix) {
    return "***";
  }

  return `*******${visibleSuffix}`;
};
