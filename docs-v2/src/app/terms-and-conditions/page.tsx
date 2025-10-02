export const metadata = {
  title: "Terms and Conditions",
  description: "Rybbit terms and conditions of service",
};

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms and Conditions</h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
        <p>
          By accessing and using Rybbit, you accept and agree to be bound by the terms and provision of this agreement.
          If you do not agree to these terms, please do not use our service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Description of Service</h2>
        <p>
          Rybbit is an open-source, privacy-friendly web analytics platform. We provide both a cloud-hosted service and
          self-hosted software that enables website owners to collect and analyze visitor statistics while respecting
          user privacy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Service</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Acceptable Use</h3>
        <p>You agree to use Rybbit only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the service in any way that violates any applicable law or regulation</li>
          <li>Attempt to gain unauthorized access to any portion of the service</li>
          <li>Interfere with or disrupt the service or servers</li>
          <li>Use the service to collect personally identifiable information without proper consent</li>
          <li>Resell or redistribute the cloud service without authorization</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Account Responsibilities</h3>
        <p>For cloud service users:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You are responsible for all activities that occur under your account</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
          <li>You must provide accurate and complete information when creating an account</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Open Source License</h2>
        <p>
          Rybbit is open-source software released under the MIT License. The self-hosted version is free to use,
          modify, and distribute according to the terms of that license. These Terms and Conditions apply specifically
          to the use of our cloud-hosted service and website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Service Availability</h2>
        <p>
          We strive to provide reliable service but do not guarantee uninterrupted access. We reserve the right to
          modify, suspend, or discontinue any part of the service at any time with or without notice. We are not liable
          for any modification, suspension, or discontinuation of the service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data and Privacy</h2>
        <p>
          Our collection and use of data is governed by our
          <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 mx-1">
            Privacy Policy
          </a>
          . By using Rybbit, you consent to our privacy practices as described in that policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p>
          The Rybbit name, logo, and branding are property of Rybbit. The open-source code is available under the MIT
          License. All other content on this website, including text, graphics, and documentation, is protected by
          copyright and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Rybbit and its contributors shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
          directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your use or inability to use the service</li>
          <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
          <li>Any interruption or cessation of transmission to or from the service</li>
          <li>Any bugs, viruses, or other harmful code that may be transmitted through the service</li>
          <li>Any errors or omissions in any content or for any loss or damage incurred from use of any content</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimer of Warranties</h2>
        <p>
          The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without any warranties of
          any kind, whether express or implied. We do not warrant that the service will be uninterrupted, secure, or
          error-free, or that any defects will be corrected.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to the service immediately, without prior
          notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the
          service will cease immediately.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Rybbit and its contributors from any claims, damages, losses,
          liabilities, and expenses (including legal fees) arising from your use of the service or violation of these
          Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict
          of law provisions. Any disputes arising from these Terms or use of the service shall be resolved in
          appropriate courts.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify users of any material changes by
          posting the updated Terms on this page with a revised date. Your continued use of the service after such
          changes constitutes acceptance of the modified Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or
          eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Entire Agreement</h2>
        <p>
          These Terms, along with our Privacy Policy, constitute the entire agreement between you and Rybbit regarding
          the use of the service and supersede any prior agreements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at:
          <a href="https://www.rybbit.io/contact" className="text-emerald-400 hover:text-emerald-300 ml-1">
            hello@rybbit.io
          </a>
        </p>
      </div>
    </div>
  );
}
