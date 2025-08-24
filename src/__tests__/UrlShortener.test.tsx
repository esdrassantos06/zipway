import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LinkForm } from "@/components/dashboard/LinkForm";

import { toast } from "sonner";

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("ShortenUrlForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    render(<LinkForm />);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the ShortenUrlForm component", () => {
    expect(screen.getByTestId("shorten-link-title")).toBeInTheDocument();
  });

  it("should click and type in the input", () => {
    const input = screen.getByTestId("original-url-input");

    fireEvent.change(input, { target: { value: "https://www.google.com" } });
    expect(input).toHaveValue("https://www.google.com");
  });

  it("should show the shortened URL if the API call succeeds", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        short_url: "https://shly.pt/abc123",
        original_url: "https://valid-url.com",
      }),
    } as Response);

    const input = screen.getByTestId("original-url-input");

    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetUrl: "https://valid-url.com",
        custom_id: "",
      }),
    });

    await waitFor(() => {
      expect(screen.getByTestId("shortened-url-display")).toBeInTheDocument();
    });

    expect(screen.getByTestId("shortened-url-display")).toHaveValue(
      "https://shly.pt/abc123",
    );
  });

  it("should handle API errors gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid request" }),
    } as Response);

    const input = screen.getByTestId("original-url-input");

    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid request");
    });
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const input = screen.getByTestId("original-url-input");
    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });
  });
});
