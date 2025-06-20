"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="zipwayCookieConsent"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        padding: "5px 12px",
        boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
        fontSize: "14px",
      }}
      contentStyle={{
        flex: "1 1 auto",
      }}
      buttonStyle={{
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        borderRadius: "10px",
        padding: "8px 10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
      }}
      declineButtonStyle={{
        backgroundColor: "var(--decline-bg)",
        color: "white",
        borderRadius: "10px",
        padding: "8px 10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      We use cookies to enhance your experience. Read more in our{" "}
      <Link
        href="/cookies"
        style={{
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          color: "var(--primary)",
        }}
      >
        Cookies Policy
      </Link>
      .
    </CookieConsent>
  );
}
