import {
  copyToClipboard,
  getInitials,
  getShortUrl,
  getStatusDisplay,
  getStatusLabel,
  openLink,
  truncateUrl,
} from "@/utils/AppUtils";
import { toast } from "sonner";

describe("copyToClipboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show error if clipboard API is not supported", () => {
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
    });
    copyToClipboard("text");

    expect(toast.error).toHaveBeenCalled();

    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
    });
  });

  it("should copy text and show success toast", async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
    });

    await copyToClipboard("my text");

    expect(writeTextMock).toHaveBeenCalledWith("my text");
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show error toast on failure", async () => {
    const writeTextMock = jest.fn().mockRejectedValue(new Error("fail"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
    });

    await copyToClipboard("fail");

    expect(toast.error).toHaveBeenCalled();
  });
});

describe("getShortUrl", () => {
  it("should return the shortURL", () => {
    const shortURL = "testSlug";
    expect(getShortUrl(shortURL)).toBe(
      `${process.env.NEXT_PUBLIC_URL}/${shortURL}`,
    );
  });
});

describe("truncateURL", () => {
  it("should return the full URL if short enough", () => {
    const shortURL = "https://yt.com";
    expect(truncateUrl(shortURL)).toBe(shortURL);
  });

  it("should truncate if url is large enough", () => {
    const longURL =
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1";
    expect(truncateUrl(longURL, 25)).toBe("https://www.youtube.com/w...");
  });
});

describe("getInitials", () => {
  it("should get name initials:", () => {
    const initalName = "Esdras Santos";
    expect(getInitials(initalName)).toBe("ES");
  });
});

describe("openLink", () => {
  it("should call window.open with the correct parameters", () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    const url = "https://example.com";
    openLink(url);

    expect(openSpy).toHaveBeenCalledWith(url, "_blank", "noopener,noreferrer");

    openSpy.mockRestore();
  });
});

describe("getStatusDisplay", () => {
  it("should return 'active' for 'active' status", () => {
    expect(getStatusDisplay("active")).toBe("active");
  });

  it("should return 'active' for 'ACTIVE' status", () => {
    expect(getStatusDisplay("ACTIVE")).toBe("active");
  });

  it("should return 'active' for mixed case 'Active' status", () => {
    expect(getStatusDisplay("Active")).toBe("active");
  });

  it("should return 'paused' for 'paused' status", () => {
    expect(getStatusDisplay("paused")).toBe("paused");
  });

  it("should return 'paused' for 'PAUSED' status", () => {
    expect(getStatusDisplay("PAUSED")).toBe("paused");
  });

  it("should return 'paused' for 'inactive' status", () => {
    expect(getStatusDisplay("inactive")).toBe("paused");
  });

  it("should return 'paused' for empty string", () => {
    expect(getStatusDisplay("")).toBe("paused");
  });

  it("should return 'paused' for undefined status", () => {
    expect(getStatusDisplay(undefined)).toBe("paused");
  });

  it("should return 'paused' for random string", () => {
    expect(getStatusDisplay("random")).toBe("paused");
  });
});

describe("getStatusLabel", () => {
  it("should return 'Active' for 'active' status", () => {
    expect(getStatusLabel("active")).toBe("Active");
  });

  it("should return 'Active' for 'ACTIVE' status", () => {
    expect(getStatusLabel("ACTIVE")).toBe("Active");
  });

  it("should return 'Active' for mixed case 'Active' status", () => {
    expect(getStatusLabel("Active")).toBe("Active");
  });

  it("should return 'Paused' for 'paused' status", () => {
    expect(getStatusLabel("paused")).toBe("Paused");
  });

  it("should return 'Paused' for 'PAUSED' status", () => {
    expect(getStatusLabel("PAUSED")).toBe("Paused");
  });

  it("should return 'Paused' for 'inactive' status", () => {
    expect(getStatusLabel("inactive")).toBe("Paused");
  });

  it("should return 'Paused' for empty string", () => {
    expect(getStatusLabel("")).toBe("Paused");
  });

  it("should return 'Paused' for undefined status", () => {
    expect(getStatusLabel(undefined)).toBe("Paused");
  });

  it("should return 'Paused' for random string", () => {
    expect(getStatusLabel("random")).toBe("Paused");
  });
});
