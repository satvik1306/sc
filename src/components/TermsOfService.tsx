import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceProps {
  children: React.ReactNode; // This will be the trigger element
}

export function TermsOfService({ children }: TermsOfServiceProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-heading">Terms of Service</DialogTitle>
          <DialogDescription>
            Effective Date: September 17, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="p-6 pt-2">
          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Company Name: Saridena Constructions Pvt. Ltd.</p>
              <p>Project: LakeWoods Villas</p>
              <p>Contact: +91 63871 19708 | careers@saridenaconstructions.com</p>
              <p>Address: 4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad, Telangana</p>
            </div>

            <section>
              <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern all services, interactions, and transactions between Saridena Constructions Pvt. Ltd. ("Company", "we", "us") and the Client ("Client", "you") with respect to the development and purchase of villas under our flagship project: LakeWoods Villas.
              </p>
              <p className="text-muted-foreground mt-2">
                By engaging with Saridena Constructions, making a booking, or entering into a contract, the Client agrees to be bound by these Terms. These Terms are designed to ensure transparency, clarity, and protection for both parties.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">2. Project Scope</h3>
              <p className="font-medium mb-2">Saridena Constructions is currently developing its sole and flagship project:</p>
              <div className="pl-4 space-y-2 text-muted-foreground">
                <p>LakeWoods Villas</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>29 ultra-luxury triplex villas</li>
                  <li>Plot sizes ranging from 945 to 1,360 sq. yds</li>
                  <li>Built-up areas from 9,550 to 11,150 sq. ft</li>
                  <li>Located near Mrugavani National Park and Osman Sagar, Hyderabad</li>
                  <li>Each villa is 100% Vaastu compliant with no shared walls</li>
                  <li>Designed for privacy, sustainability, and elegant living</li>
                </ul>
              </div>
              <p className="text-muted-foreground mt-2">
                No other projects are being developed, offered, or marketed by Saridena Constructions as of September 2025. All communications or offers are limited to LakeWoods Villas only.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Booking & Reservation</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>A booking is confirmed only upon payment of the specified booking amount and completion of required documentation.</li>
                <li>Booking is non-transferable unless approved in writing by Saridena Constructions.</li>
                <li>Allotment is at the sole discretion of the Company and subject to availability.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">4. Pricing & Payment Terms</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Pricing: Villas range from ₹7.84 Cr. to ₹11.29 Cr. depending on plot size and configuration.</li>
                <li>Payment Plans: Customizable and flexible payment schedules are available upon request.</li>
                <li>All payments must be made via bank transfer or cheque to designated Company accounts only.</li>
                <li>Late payments may attract interest charges as specified in the Sale Agreement.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Documentation & Agreements</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Upon booking, the Client will be required to sign a Sale Agreement, Construction Agreement, and Payment Schedule.</li>
                <li>All documentation will comply with applicable RERA regulations and Telangana state real estate laws.</li>
                <li>The Company reserves the right to cancel bookings where documentation is not completed within the stipulated period.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">6. Possession & Handover</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Estimated possession timeline will be communicated at the time of agreement.</li>
                <li>Delivery is subject to timely payment and compliance by the Client.</li>
                <li>Delays caused by Force Majeure (see Section 10) or regulatory approvals shall not be considered a breach.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">7. Warranty & Maintenance</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>We provide a 12-month warranty on structure and workmanship from the date of possession.</li>
                <li>Post-handover maintenance will be managed by a professional facility management agency appointed by the Company.</li>
                <li>The Client is responsible for ongoing maintenance charges as applicable.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">8. Modifications & Customizations</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Customization requests must be made in writing and are subject to feasibility and additional cost.</li>
                <li>Structural modifications will not be permitted unless agreed in advance and compliant with approvals.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">9. Client Responsibilities</h3>
              <p className="mb-2">The Client agrees to:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Furnish accurate documentation and KYC information</li>
                <li>Make payments in a timely manner</li>
                <li>Comply with community guidelines post-possession</li>
                <li>Not sublet, sell, or advertise the property without notifying the Company until full payment and registration are complete</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">10. Force Majeure</h3>
              <p className="mb-2 text-muted-foreground">Saridena Constructions shall not be held liable for delays or non-performance due to circumstances beyond its control, including but not limited to:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Natural disasters</li>
                <li>Changes in government regulations</li>
                <li>Labor strikes</li>
                <li>Material shortages</li>
                <li>Pandemic-related restrictions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">11. Legal & Dispute Resolution</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>These Terms are governed by the laws of India and the jurisdiction of Hyderabad, Telangana.</li>
                <li>Disputes will be resolved through mediation, failing which they will be subject to binding arbitration.</li>
                <li>The arbitration venue will be Hyderabad, and the language of arbitration will be English.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">12. Confidentiality & Privacy</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Client data is handled with the utmost confidentiality and used only for project-related communication and regulatory compliance.</li>
                <li>We do not share or sell client data to third parties, brokers, or external advertisers.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">13. Intellectual Property & Branding</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>All design elements, floor plans, branding materials, and content related to LakeWoods Villas are the intellectual property of Saridena Constructions.</li>
                <li>Clients are not permitted to reproduce, distribute, or use project materials for commercial purposes without express written permission.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">14. Changes to Terms</h3>
              <p className="text-muted-foreground">Saridena Constructions reserves the right to revise these Terms periodically. Any updates will apply to future interactions and not retroactively unless legally required.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">15. Contact & Support</h3>
              <p className="mb-2">For any questions or concerns, please contact:</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Saridena Constructions Pvt. Ltd.</p>
                <p>📍 4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad</p>
                <p>📞 +91 63871 19708</p>
                <p>✉️ careers@saridenaconstructions.com</p>
              </div>
            </section>

            <section className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">✅ Client Acknowledgment</h3>
              <p className="text-muted-foreground">By engaging with Saridena Constructions or booking a villa at LakeWoods, you acknowledge that you have read, understood, and agreed to the above Terms of Service.</p>
            </section>

            <div className="text-center font-heading text-lg text-accent italic">
              "We Build With Our Heart, Not Just Concrete."
            </div>
            <div className="text-center text-sm text-muted-foreground">
              LakeWoods Villas — A rare composition of earth, light, and intent.
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}