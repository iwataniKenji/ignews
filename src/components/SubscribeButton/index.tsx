import { useSession, signIn } from 'next-auth/react';
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  
  function handleSubscribe() {
    // se não houver sessão -> autenticar
    if (!session) {
      signIn('github')
      return;
    }

    // criação da checkout session
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}
