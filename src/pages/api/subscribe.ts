import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // verifica se método da request é POST ("criando")
  if (req.method === "POST") {
    // backend consegue pegar sessão do usuário através de cookies (req)
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    // se não existir
    if (!customerId) {
      // cria novo customer
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      // salva customer no banco
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      // reatribui customer na variável
      customerId = stripeCustomer.id;
    }

    // informações para criação do checkout
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1Kgc7nGHxfJecL8MmyS7kfbV", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,

      // quando der sucesso ou falha, onde redirecionar
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
