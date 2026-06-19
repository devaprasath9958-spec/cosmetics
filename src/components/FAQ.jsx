import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Are your products cruelty-free?",
    answer: "Yes, all Lumé products are 100% cruelty-free. We do not test on animals, nor do we ask others to test on our behalf."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship to the US, Canada, UK, Australia, and select European countries. We are working on expanding our delivery network."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, you can return it within 30 days of receiving your order for a full refund."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive an email with tracking information. You can also track your order using the 'Track Order' link in the footer by entering your order ID."
  },
  {
    question: "Are your products suitable for sensitive skin?",
    answer: "Our formulations are designed with gentle, skin-loving ingredients. However, everyone's skin is different, so we recommend patch testing before full application."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl mb-4 text-ivory">Frequently Asked Questions</h1>
          <p className="text-smoke">Find answers to common questions about our products, shipping, and returns.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-obsidian-light border border-obsidian-border rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-ivory">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-smoke shrink-0" />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-smoke text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
