import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import EnquiryForm from "@/components/EnquiryForm";
import ContactInfo from "@/components/ContactInfo";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHead title="Contact us" kicker="We usually reply within a working day." />
      <section className="wrap page split">
        <EnquiryForm type="contact" />
        <ContactInfo />
      </section>
    </>
  );
}
