import React from "react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} className="border border-[#444e57] p-2 rounded w-full" />;
};
