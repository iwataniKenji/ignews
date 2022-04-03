import { stripe } from "./../../../services/stripe";
import { fauna } from "./../../../services/fauna";
import { query as q } from "faunadb";

// save information on database
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

  // retrieve all data from subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // choosing only most important data to save on database
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    // if it's a new subscription -> save on db
    await fauna.query(
      q.Create(q.Collection("subscriptions"), {
        data: subscriptionData,
      })
    );
  } else {
    // if this subscription already exists -> search for ref and change data
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
