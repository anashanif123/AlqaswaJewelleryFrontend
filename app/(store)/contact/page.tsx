import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHead title="Visit or write to us" kicker="We reply within a working day" crumbs={[{ label: "Contact" }]} />
      <section className="wrap page split">
        <EnquiryForm type="contact" />
        <aside className="summary">
          <h3>Studio</h3>
          <p>Gulberg III, Lahore<br />Mon to Sat, 12 to 9 pm</p>
          <h3>Call or WhatsApp</h3>
          <p><a className="link" href="tel:+923120253799">+92 312 0253799</a> · <a className="link" href="https://wa.me/923120253799">WhatsApp</a></p>
          <h3>Email</h3>
          <p><a className="link" href="mailto:hello@alqaswa.pk">hello@alqaswa.pk</a></p>
        </aside>
      </section>
    </>
  );
}
