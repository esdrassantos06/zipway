import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LinkForm } from "@/components/dashboard/LinkForm";
import { toast } from "sonner";

const mockRefresh = jest.fn();
const mockCreateShortLink = jest.fn();

jest.mock("@/lib/api-client", () => ({
  createShortLink: (...args: any[]) => mockCreateShortLink(...args),
}));

describe("ShortenUrlForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateShortLink.mockClear();
    mockRefresh.mockClear();
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
    mockCreateShortLink.mockResolvedValueOnce({
      short_url: "https://shly.pt/abc123",
      details: { original_url: "https://valid-url.com" },
    });

    const input = screen.getByTestId("original-url-input");

    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    expect(mockCreateShortLink).toHaveBeenCalledWith(
      "https://valid-url.com",
      undefined,
    );

    await waitFor(() => {
      expect(screen.getByTestId("shortened-url-display")).toBeInTheDocument();
    });

    expect(screen.getByTestId("shortened-url-display")).toHaveValue(
      "https://shly.pt/abc123",
    );
  });

  it("should handle API errors gracefully", async () => {
    mockCreateShortLink.mockRejectedValueOnce(new Error("Invalid request"));

    const input = screen.getByTestId("original-url-input");

    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid request");
    });
  });

  it("should handle network errors", async () => {
    mockCreateShortLink.mockRejectedValueOnce(new Error("Network error"));

    const input = screen.getByTestId("original-url-input");
    fireEvent.change(input, { target: { value: "https://valid-url.com" } });

    const button = screen.getByTestId("shorten-url-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network error");
    });
  });
});
