import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  test("sign in button is rendering correctly when user is not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    // sessão nula e loading falso
    useSessionMocked.mockReturnValueOnce([null, false] as any);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  test("sign in button is rendering correctly when user is authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
      },
    } as any);

    const { debug } = render(<SignInButton />);
    debug();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
