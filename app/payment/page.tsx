"use client";

import { Icon } from "@iconify/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import "./payment.css";

const PAYMENT_METHODS = [
  {
    name: "PayPal",
    url: "https://paypal.me/akrysto",
    icon: "simple-icons:paypal",
    color: "#7cbbef",
    display: "paypal.me/akrysto",
    description: "For a payment we’ve already agreed on.",
  },
  {
    name: "Ko-fi",
    url: "https://ko-fi.com/akryst",
    icon: "simple-icons:kofi",
    color: "#ff7d79",
    display: "ko-fi.com/akryst",
    description: "Leave a little support for my work.",
  },
];

export default function PaymentPage() {
  return <main className="payment-page">
    <div className="payment-inner">
      <section className="payment-content" aria-labelledby="payment-heading">
        <TransitionLink href="/" className="payment-back"><Icon icon="mdi:arrow-left" width={14} /> back home</TransitionLink>
        <header className="payment-heading">
          <h1 id="payment-heading">payments<br />&amp; support</h1>
          <p>For an agreed payment or a little support.</p>
        </header>
        <ul className="payment-methods" aria-label="Payment and support platforms">
          {PAYMENT_METHODS.map(method => <li key={method.name}>
            <a href={method.url} target="_blank" rel="noopener noreferrer" className="payment-method" aria-label={`${method.name}: ${method.description} Opens in a new tab.`}>
              <Icon icon={method.icon} width={25} height={25} className="payment-icon" style={{ color: method.color }} aria-hidden="true" />
              <span className="payment-method-copy">
                <span className="payment-method-heading"><strong>{method.name}</strong><span className="payment-address">{method.display}</span></span>
                <span className="payment-description">{method.description}</span>
              </span>
              <Icon icon="mdi:open-in-new" width={16} className="payment-external" aria-hidden="true" />
            </a>
          </li>)}
        </ul>
      </section>
    </div>
  </main>;
}
