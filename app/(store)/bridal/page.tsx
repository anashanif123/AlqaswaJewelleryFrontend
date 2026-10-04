import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import EnquiryForm from "@/components/EnquiryForm";
import { Bridal } from "@/components/Sections";

export const metadata: Metadata = { title: "Bridal sittings" };

export default function BridalPage() {
  return (
    <>
      <PageHead title="Bridal sittings" kicker="At our Gulberg studio or on video call" crumbs={[{ label: "Bridal" }]} />
      <Bridal />
      <section className="wrap page narrow">
        <div className="section-head"><h2>Request a sitting</h2></div>
        <EnquiryForm type="bridal" />
      </section>
    </>
  );
}
