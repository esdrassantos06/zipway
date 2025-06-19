import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LinkForm } from "@/components/dashboard/LinkForm";

jest.mock("@/utils/axios.ts", () => ({
  __esModule: true,
  shortenUrl: jest.fn(),
}));

import { shortenUrl } from "@/utils/axios";

jest.mock("sonner", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Toaster: () => <div />,
}));

import { toast } from "sonner";

describe("ShortenUrlForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<LinkForm />);
  });

  it("should render the ShortenUrlForm component", () => {
    expect(screen.getByText("Shorten")).toBeInTheDocument();
  });

  it("should click and type in the input", () => {
    const input = screen.getByPlaceholderText(
      "https://example.com/very/long/url",
    );
    fireEvent.change(input, { target: { value: "https://www.google.com" } });
    expect(input).toHaveValue("https://www.google.com");
  });

  it("should show an error message if the URL is invalid", async () => {
    (shortenUrl as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const input = screen.getByPlaceholderText(
      "https://example.com/very/long/url",
    );
    fireEvent.change(input, { target: { value: "invalid-url" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid URL")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid URL");
    });
  });

  it("should show the shortened URL if the API call succeeds", async () => {
    const fakeShortUrl = "http://short.ly/abc123";

    (shortenUrl as jest.Mock).mockResolvedValue({
      data: { short_url: fakeShortUrl },
    });

    const input = screen.getByPlaceholderText(
      "https://example.com/very/long/url",
    );
    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByDisplayValue(fakeShortUrl)).toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith("URL Shortened Sucessfully.");
    });
  });
});
