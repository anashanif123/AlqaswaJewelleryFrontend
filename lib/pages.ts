// Content for the help / info pages (footer links). Edit the copy here.
export const infoPages: Record<string, { title: string; kicker: string; sections: { h: string; p: string[] }[] }> = {
  "our-story": {
    title: "Our story", kicker: "Designed and finished in Lahore",
    sections: [
      { h: "Where we began", p: ["Al Qaswa started in a small workshop in the old city, where our founders learned to draw gold by hand. The arches, crescents and jaali screens of Lahore still shape every piece we make."] },
      { h: "How we work", p: ["Every design is sketched, cast and finished by our own karigars. We hallmark all of our gold and list the purity and weight on every piece, so you always know exactly what you are buying."] },
      { h: "Made to be handed down", p: ["We build jewellery to be worn every day and passed on. That is why we resize for free for a year and offer a lifetime polish on anything bought from us."] },
    ],
  },
  delivery: {
    title: "Delivery", kicker: "Insured delivery across Pakistan",
    sections: [
      { h: "How long it takes", p: ["Pieces in stock leave our studio within one working day. Lahore orders usually arrive the next day; the rest of Pakistan takes 2 to 5 working days."] },
      { h: "Cost", p: ["A flat delivery fee is shown at checkout before you pay. Every parcel is insured until it reaches you."] },
      { h: "Made-to-order pieces", p: ["Custom and bridal pieces take 3 to 6 weeks. We share progress photos and confirm the delivery date with you."] },
    ],
  },
  returns: {
    title: "Returns & exchange", kicker: "7-day easy exchange",
    sections: [
      { h: "Exchange within 7 days", p: ["Changed your mind? Send the piece back unworn, with its box and certificate, within 7 days of delivery and swap it for anything else in the store."] },
      { h: "What cannot be exchanged", p: ["Engraved, resized or made-to-order pieces cannot be exchanged unless there is a fault."] },
      { h: "Faults", p: ["If anything is wrong with your piece, tell us within 7 days and we will repair or replace it at no cost, including delivery both ways."] },
    ],
  },
  "size-guide": {
    title: "Ring size guide", kicker: "Find your fit at home",
    sections: [
      { h: "Measure a ring you own", p: ["Place a ring that fits well on a ruler and measure the inside diameter in millimetres.", "15.7 mm = size 5 · 16.5 mm = size 6 · 17.3 mm = size 7 · 18.1 mm = size 8 · 18.9 mm = size 9"] },
      { h: "Measure your finger", p: ["Wrap a thin strip of paper around the base of your finger, mark where it meets and measure the length.", "49.3 mm = size 5 · 51.9 mm = size 6 · 54.4 mm = size 7 · 57 mm = size 8 · 59.5 mm = size 9"] },
      { h: "Still not sure?", p: ["Choose the closest size. We resize for free for a year."] },
    ],
  },
  care: {
    title: "Care for your gold", kicker: "Keep it shining for years",
    sections: [
      { h: "Everyday care", p: ["Put jewellery on last, after perfume and creams, and take it off before swimming, exercise or cleaning."] },
      { h: "Cleaning", p: ["Soak in warm water with a drop of mild soap, brush gently with a soft toothbrush and dry with a lint-free cloth. Pearls only need a soft, dry cloth."] },
      { h: "Storage", p: ["Keep each piece in its own pouch so stones do not scratch the gold. Bring it to the studio any time for a free polish."] },
    ],
  },
};
