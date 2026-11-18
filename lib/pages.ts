// Store copy: help / policy pages (footer links), product-page features and FAQs.
// Please check the days, fees and rules below match how you actually work before going live.

export const features = [
  "Hand-finished with care",
  "Premium quality polish",
  "Easy exchange",
  "Dedicated WhatsApp support",
];

export const faqs = [
  { q: "Is this real gold?", a: "No. Our pieces are premium artificial jewellery with gold, silver or antique plating and zircon, kundan or pearl stones." },
  { q: "Do you offer cash on delivery?", a: "Yes, cash on delivery is available all over Pakistan." },
  { q: "How long does delivery take?", a: "Most orders arrive in 2 to 5 working days. You get a tracking number once your parcel is booked." },
  { q: "How do I keep the shine?", a: "Keep it away from water, perfume and creams, wipe it with a soft dry cloth and store it in its box or a zip pouch." },
];

export const infoPages: Record<string, { title: string; kicker: string; sections: { h: string; p: string[] }[] }> = {
  "our-story": {
    title: "About us", kicker: "Premium artificial jewellery, delivered across Pakistan",
    sections: [
      { h: "Who we are", p: ["Al Qaswa brings you artificial jewellery that looks expensive without the price tag: earrings, bangles, rings, sets, bridal sets and pendants for every occasion."] },
      { h: "How we choose", p: ["Every design is picked by hand and checked before it is packed. We photograph the real piece, so what you see is what arrives at your door."] },
      { h: "Here to help", p: ["Not sure about a colour or size? Message us on WhatsApp and we will show you the piece live on a video call."] },
    ],
  },
  delivery: {
    title: "Shipping policy", kicker: "Delivery all over Pakistan",
    sections: [
      { h: "Delivery time", p: ["Orders are packed within one working day. Delivery usually takes 2 to 5 working days, depending on your city."] },
      { h: "Delivery charges", p: ["The delivery fee is shown at checkout before you place your order. Orders above the free shipping amount ship free."] },
      { h: "Cash on delivery", p: ["Pay in cash when your parcel arrives. Please write your complete address with house number, street and a nearby landmark so the rider can find you."] },
    ],
  },
  returns: {
    title: "Return & exchange policy", kicker: "Easy exchange within 7 days",
    sections: [
      { h: "Exchange within 7 days", p: ["You can exchange a piece within 7 days of delivery. Tell us by call or WhatsApp first, then send it back unused in its original packing."] },
      { h: "Damaged or wrong item", p: ["If your piece arrives damaged or different from what you ordered, tell us within 7 days and we will replace it at no cost."] },
      { h: "What we cannot exchange", p: ["Used, scratched or altered pieces cannot be exchanged unless there is a fault."] },
    ],
  },
  "size-guide": {
    title: "Size guide", kicker: "Find your ring and bangle size at home",
    sections: [
      { h: "Rings", p: ["Measure the inside diameter of a ring that fits you well.", "15.7 mm = size 5 · 16.5 mm = size 6 · 17.3 mm = size 7 · 18.1 mm = size 8 · 18.9 mm = size 9"] },
      { h: "Bangles", p: ["Measure the inside diameter of a bangle you wear.", "2.4 = 57 mm · 2.6 = 60 mm · 2.8 = 63.5 mm · 2.10 = 67 mm"] },
      { h: "Still not sure?", p: ["Message us on WhatsApp and we will help you choose."] },
    ],
  },
  care: {
    title: "Jewellery care", kicker: "Keep the shine for longer",
    sections: [
      { h: "Everyday care", p: ["Put jewellery on last, after perfume, hairspray and creams. Take it off before washing hands, bathing, swimming or exercise."] },
      { h: "Cleaning", p: ["Wipe gently with a soft, dry cloth after wearing. Do not use water, soap or polish liquids on plated jewellery."] },
      { h: "Storage", p: ["Store each piece in its box or an airtight zip pouch, away from moisture, so the plating and stones stay bright."] },
    ],
  },
};
