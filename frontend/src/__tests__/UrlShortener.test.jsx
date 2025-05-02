import { render, screen, fireEvent } from "@testing-library/react";
import { ShortenUrlForm } from "@/components/ShortenUrlForm";

describe("ShortenUrlForm", () => {
    beforeEach(() => {
        render(<ShortenUrlForm />);
    });

    it("should render the ShortenUrlForm component", () => {
        expect(screen.getByText("Enter your URL")).toBeInTheDocument();
    });

    it("should click and type in the input", () => {
        const input = screen.getByPlaceholderText("https://example.com/very/long/url");
        fireEvent.change(input, { target: { value: "https://www.google.com" } });
        expect(input).toHaveValue("https://www.google.com");
    });

    it("should show an error message if the URL is invalid", () => {

        const testUrls = [
            "invalid-url",              // Invalid
            "http://",                  // Invalid
            "https://",                 // Invalid
            "http://localhost",         // Valid (but can be invalid depending on usage context)
            "https://localhost",        // Valid (but can be invalid depending on usage context)
            "http://localhost:",        // Invalid
            "http://.com",              // Invalid
            "http://example",           // Invalid
            "ftp://example.com",        // Invalid
            "example.com",              // Invalid
            "http://127.0.0.1:"        // Invalid
        ];

        testUrls.forEach(invalidUrl => {
            const input = screen.getByPlaceholderText("https://example.com/very/long/url");
            fireEvent.change(input, { target: { value: invalidUrl } });

            const button = screen.getByTestId("shorten-url-button");
            fireEvent.click(button);

            const errorMessage = screen.getAllByText("Please enter a valid URL");

            expect(errorMessage.length).toBeGreaterThan(0);
        });
    });
});