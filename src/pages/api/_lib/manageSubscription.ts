import { stripe } from "./../../../services/stripe";
import { fauna } from "./../../../services/fauna";
import { query as q } from "faunadb";

// salva informações no banco de dados
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction: boolean = false
) {
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

  if (createAction) {
    // se criando nova subscription -> salvar no banco
    await fauna.query(
      q.Create(q.Collection("subscriptions"), {
        data: subscriptionData,
      })
    );
  } else {
    // se atualizando subscription -> busca pela ref e troca todos os dados
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        {
          data: subscriptionData,
        }
      )
    );
  }
}
