import { NextApiRequest, NextApiResponse } from "next";

// node do next.js -> dados não acessíveis ao cliente final
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const users = [
    { id: 1, name: "Diego" },
    { id: 2, name: "Dani" },
    { id: 3, name: "Rafa" },
  ];

  return response.json(users);
}
