import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const sections = [
{
id: "introduction",
title: "Introduction",
content:
"Welcome to Trendzity ('we,' 'our,' or 'us'). Your privacy is important to us. This Privacy Policy explains how Trendzity collects, uses, stores, and protects your information when you access our website, applications, and services."
},
{
id: "information",
title: "Information We Collect",
content:
"We may collect information you provide such as name, email address, profile picture, company information, social media account information, and content submitted through the platform. We may also collect IP address, browser type, device information, operating system, usage data, log files, cookies, and similar technologies."
},
{
id: "social-login",
title: "Social Login Authentication",
content:
"Trendzity allows users to sign in using Google, Facebook (Meta), and LinkedIn. We may receive your name, email address, profile photo, and unique account identifier. We only access information you authorize and never access your passwords."
},
{
id: "usage",
title: "How We Use Information",
content:
"To create and manage accounts, authenticate users, improve services, personalize experiences, communicate updates, provide support, prevent fraud, and comply with legal obligations."
},
{
id: "sharing",
title: "Data Sharing",
content:
"We do not sell personal information. Information may be shared with trusted service providers and when legally required."
},
{
id: "security",
title: "Data Security",
content:
"We implement reasonable technical and organizational safeguards to protect personal information."
},
{
id: "cookies",
title: "Cookies",
content:
"Cookies may be used to maintain sessions, improve functionality, analyze usage, and enhance user experience."
},
{
id: "rights",
title: "User Rights",
content:
"Users may request access, correction, deletion, restriction, objection, or portability of personal data where applicable."
},
{
id: "deletion",
title: "Account Deletion",
content:
"Users may request deletion of their account and associated personal information by contacting [privacy@trendzity.com](mailto:privacy@trendzity.com)."
},
{
id: "google",
title: "Google OAuth Statement",
content:
"Trendzity uses Google OAuth solely for authentication purposes. We do not access, store, share, or use Google user data beyond the basic profile information necessary to create and manage user accounts."
},
{
id: "meta",
title: "Meta & LinkedIn Statement",
content:
"Trendzity only accesses the minimum profile information authorized by users during authentication. We do not post content, access private messages, or perform actions on behalf of users without explicit permission."
},
{
id: "contact",
title: "Contact",
content:
"Email: support@trendzity.com \n Website: trendzity.com"
}
];

export default function PrivacyPolicy() {
return ( <div className="min-h-screen bg-background"> <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <div className="mb-8">
        <div className="mb-6">
        <Link to="/">
            <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
            </Button>
        </Link>
        </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">
        Privacy Policy
      </h1>

      <p className="mt-3 text-muted-foreground">
        Last Updated: June 15, 2026
      </p>
    </div>

    <div className="grid lg:grid-cols-[260px_1fr] gap-10">

      <aside className="hidden lg:block">
        <div className="sticky top-24 border border-border rounded-2xl p-5 bg-card">
          <h3 className="font-semibold mb-4">
            Contents
          </h3>

          <nav className="space-y-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="space-y-8">

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="border border-border rounded-2xl p-6 md:p-8 bg-card"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {section.title}
            </h2>

            <p className="text-muted-foreground leading-8 whitespace-pre-line">
              {section.content}
            </p>
          </section>
        ))}

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          © 2026 Trendzity. All Rights Reserved.
        </div>

      </main>
    </div>
  </div>
</div>

);
}
