import "@testing-library/jest-dom";

Object.defineProperty(global, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("nanoid", () => ({
  customAlphabet: jest.fn(() => jest.fn(() => "test123")),
}));

jest.mock("nanostores", () => ({
  atom: jest.fn(),
  computed: jest.fn(),
  map: jest.fn(),
}));

jest.mock("better-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "loading" })),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn(() => ({ data: null, status: "loading" })),
  },
}));

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
}));

global.fetch = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
});
