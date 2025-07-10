import React from "react";

type Props = {
  title: string;
  description: string;
};

export default function TestCard({ title, description }: Props) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
