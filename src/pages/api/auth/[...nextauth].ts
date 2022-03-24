import { query as q } from "faunadb";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  
  // funções executadas automaticamente quando acontece alguma ação
  callbacks: {
    async signIn({user, account, profile}) {
      const { email } = user;

      try {
        await fauna.query(
          // se não existe usuário com...
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  // esse email...
                  q.Casefold(user.email)
                )
              )
            ),
            // crie um usuário com esse email
            q.Create(
              q.Collection("users"),
              { data: { email } }
            ),
            // do contrário, busque seu referente
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        // true = login deu certo
        return true;

      } catch {

        // false = login deu errado
        return false;
      }
    },
  },
});
