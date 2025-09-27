import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface PrivacyPolicyProps {
  children: React.ReactNode;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">🔒 Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-4">
            <section>
              <p className="font-semibold">Saridena Constructions Pvt. Ltd.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">1. Introduction</h2>
              <p>At Saridena Constructions Pvt. Ltd., we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and protect your personal information in connection with your interactions with our company and our flagship project, LakeWoods Villas.</p>
              <p>By using our services, visiting our website, or engaging with our sales and customer service teams, you consent to the practices described in this Policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">2. Scope of This Policy</h2>
              <p>This policy applies to:</p>
              <ul className="list-disc pl-6">
                <li>Visitors to our website or offices</li>
                <li>Prospective and confirmed buyers of LakeWoods Villas</li>
                <li>Individuals submitting inquiries or applications</li>
                <li>Clients interacting with Saridena Constructions through any communication channel (email, phone, in-person, or digital)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">3. What Information We Collect</h2>
              <h3 className="font-semibold mt-2">a. Personal Identification Information</h3>
              <ul className="list-disc pl-6">
                <li>Full name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Residential or mailing address</li>
                <li>Government-issued ID (e.g., PAN, Aadhaar, Passport)</li>
                <li>KYC documentation</li>
              </ul>
              
              <h3 className="font-semibold mt-2">b. Property Preferences & Communications</h3>
              <ul className="list-disc pl-6">
                <li>Villa configurations or pricing options you're interested in</li>
                <li>Budget range and purchase timeline</li>
                <li>Communication history and feedback</li>
              </ul>

              <h3 className="font-semibold mt-2">c. Transaction & Legal Data</h3>
              <ul className="list-disc pl-6">
                <li>Payment receipts, sale agreements, and other legal documentation</li>
                <li>Co-applicant or nominee information</li>
                <li>Loan processing information (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">4. How We Use Your Information</h2>
              <p>We use your personal information for the following purposes:</p>
              <ul className="list-disc pl-6">
                <li>To process your inquiries, bookings, and sales documentation</li>
                <li>To personalize your experience and recommend suitable configurations or offers</li>
                <li>For legal and regulatory compliance (RERA, IT, etc.)</li>
                <li>To manage client relationships, warranties, and post-sale support</li>
                <li>To communicate important project updates or appointment reminders</li>
                <li>To safeguard against fraud or unauthorized transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">5. Data Sharing & Disclosure</h2>
              <p>Saridena Constructions does not sell or rent your personal data.</p>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6">
                <li>Legal and compliance advisors (for documentation and registration)</li>
                <li>Government authorities (as mandated by law)</li>
                <li>Financial institutions (only with your consent, e.g., for home loans)</li>
                <li>Facility management service providers (post-possession support)</li>
              </ul>
              <p>All third parties are bound by strict confidentiality and data protection agreements.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">6. Data Storage & Security</h2>
              <p>We implement industry-standard measures to protect your data, including:</p>
              <ul className="list-disc pl-6">
                <li>Secure servers and firewalls</li>
                <li>Access controls and encryption</li>
                <li>Confidentiality agreements with employees and vendors</li>
              </ul>
              <p>We retain your data for as long as necessary for the purpose for which it was collected, or as required by law.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">7. Your Rights</h2>
              <p>As a data subject, you have the right to:</p>
              <ul className="list-disc pl-6">
                <li>Access and review the personal data we hold about you</li>
                <li>Request correction or deletion of inaccurate or outdated data</li>
                <li>Withdraw consent (where applicable)</li>
                <li>Lodge a complaint with the relevant data protection authority (under Indian law)</li>
              </ul>
              <p>To exercise these rights, contact us at careers@saridenaconstructions.com</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">8. Cookies & Digital Tracking</h2>
              <p>If you visit our website, we may use cookies or analytical tools to:</p>
              <ul className="list-disc pl-6">
                <li>Understand website traffic and usage</li>
                <li>Improve user experience</li>
                <li>Serve relevant content or updates</li>
              </ul>
              <p>You can manage cookie preferences in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">9. Children's Privacy</h2>
              <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect data from minors. If we discover that we have inadvertently collected such information, we will delete it immediately.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. All updates will be published on our official communication channels. Continued engagement after changes implies your acceptance of the revised policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">11. Contact Us</h2>
              <p>For any questions, concerns, or requests regarding this Privacy Policy:</p>
              <p className="mt-2">Saridena Constructions Pvt. Ltd.</p>
              <p>📍 4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad</p>
              <p>📞 +91 63871 19708</p>
              <p>✉️ careers@saridenaconstructions.com</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">📝 A Final Word</h2>
              <p>At Saridena Constructions, your trust is as foundational as our architecture. We treat your data with the same care, confidentiality, and intention that we bring to building your future home.</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;