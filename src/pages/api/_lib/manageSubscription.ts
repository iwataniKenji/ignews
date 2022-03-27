import { stripe } from "./../../../services/stripe";
import { fauna } from "./../../../services/fauna";
import { query as q } from "faunadb";

// salva informações no banco de dados
export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  // buscar o usuário no banco do FaunaDB com o id {customerId}
  // salvar os dados da subscription no FaunaDB

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  // buscar todos os dados da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // escolhendo apenas os dados importantes a ser guardados no banco de dados
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  // salvar dados no banco de dados
  await fauna.query(
    q.Create(q.Collection("subscriptions"), {
      data: subscriptionData,
    })
  );
}
