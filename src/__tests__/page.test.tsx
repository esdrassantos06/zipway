import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("UrlShortener", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should render the Page component", () => {
    expect(screen.getByTestId("hero-test-title")).toBeInTheDocument();
  });
});
