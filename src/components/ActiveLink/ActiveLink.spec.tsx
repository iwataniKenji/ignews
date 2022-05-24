import { render, screen } from "@testing-library/react";
import { ActiveLink } from ".";

// jest.mock = sempre que importar "next/router" -> escolher o que irá retornar
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

// describe = categorização dos testes
describe("ActiveLink component", () => {
  test("active link is rendering correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    // espera-se que o elemento "Home" esteja no documento
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("active link is receiving active class", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    // espera-se que o elemento "Home" tenha a classe "active"
    expect(screen.getByText("Home")).toHaveClass("active");
  });
});
