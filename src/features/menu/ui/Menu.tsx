"use client";

import { useGetMenu } from "../hooks/useGetMenu";

export const Menu = () => {
  const { data, isLoading, error } = useGetMenu();

  if (isLoading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>Error loading menu: {error}</div>;
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
