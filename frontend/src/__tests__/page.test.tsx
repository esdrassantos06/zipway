import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("UrlShortener", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should render the Page component", () => {
    expect(screen.getByText("Zipway - URL Shortener")).toBeInTheDocument();
  });

  it("should render the ShortenUrlForm component", () => {
    const form = screen.getByTestId("shorten-url-form");
    expect(form).toBeInTheDocument();
  });
});
