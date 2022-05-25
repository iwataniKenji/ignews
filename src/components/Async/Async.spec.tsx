import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

it("renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello World")).toBeInTheDocument();

  // await waitForElementToBeRemoved(screen.queryByText());

  // await waitFor(() => {
  //   return expect(screen.queryByText("Button")).toBeInTheDocument();
  // });

  // async await findByText -> espera um componente aparecer em tela
  expect(await screen.findByText("Button")).toBeInTheDocument();
});

