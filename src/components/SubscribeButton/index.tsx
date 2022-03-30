import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe.js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    // se não houver sessão -> autenticar
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      return;
    }

    try {
      // subscribe = nome do arquivo
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
