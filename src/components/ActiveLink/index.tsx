import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

// props do Link + props do ActiveLink
interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

// children = conteúdo da âncora
// activeClassName = estilização de sublinhado amarelo
// rest = onde advém o href
export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  // asPath -> retorna a rota URL atual
  const { asPath } = useRouter();

  // se link ativo for igual ao href da ancora
  const className = asPath === rest.href ? activeClassName : "";

  // cloneElement -> clona children e possibilita props
  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
}
