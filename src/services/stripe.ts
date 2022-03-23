import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  // versão da api
  apiVersion: "2020-08-27",

  // metadados da aplicação
  appInfo: {
    name: "Ignews",
    version
  },
});
