"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  AppWindow,
  Code,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { authClient } from "../../lib/auth";
import { userStore } from "../../lib/userStore";
import { BACKEND_URL } from "../../lib/const";
import { CodeSnippet } from "../../components/CodeSnippet";
import { StandardPage } from "../../components/StandardPage";

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Step 1: Account creation
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Organization creation
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  // Step 3: Website addition
  const [domain, setDomain] = useState("");

  // Step 4: Data for tracking code
  const [siteId, setSiteId] = useState("");

  // Handle organization name change and generate slug
  const handleOrgNameChange = (value: string) => {
    setOrgName(value);
    if (value) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setOrgSlug(generatedSlug);
    }
  };

  // Validate domain
  const isValidDomain = (domain: string): boolean => {
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  // Step 1: Account creation submission
  const handleAccountSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (data?.user) {
        userStore.setState({
          user: data.user,
        });
        setCurrentStep(2);
      }

      if (error) {
        setError(error.message ?? "");
      }
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Organization creation submission
  const handleOrganizationSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Create organization
      const { data, error } = await authClient.organization.create({
        name: orgName,
        slug: orgSlug,
      });

      if (error) {
        throw new Error(error.message || "Failed to create organization");
      }

      if (!data?.id) {
        throw new Error("No organization ID returned");
      }

      // Set as active organization
      await authClient.organization.setActive({
        organizationId: data.id,
      });

      setCurrentStep(3);
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Website addition submission
  const handleWebsiteSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Validate domain
      if (!isValidDomain(domain)) {
        setError(
          "Invalid domain format. Must be a valid domain like example.com or sub.example.com"
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          name: domain,
          // The organization ID is already set as active from previous step
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add site");
      }

      const data = await response.json();
      setSiteId(data.siteId);
      setCurrentStep(4);
    } catch (error) {
      setError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Render the content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6">Create your account</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAccountSubmit}
                className="w-full mt-6"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Creating account..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/",
                    });
                  }}
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    authClient.signIn.social({
                      provider: "github",
                      callbackURL: "/",
                    });
                  }}
                >
                  GitHub
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    authClient.signIn.social({
                      provider: "twitter",
                      callbackURL: "/",
                    });
                  }}
                >
                  X
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Log in
                </Link>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Create your organization
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  type="text"
                  placeholder="Acme Inc."
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgSlug">
                  Organization Slug
                  <span className="text-xs text-muted-foreground ml-2">
                    (URL identifier)
                  </span>
                </Label>
                <Input
                  id="orgSlug"
                  type="text"
                  placeholder="acme-inc"
                  value={orgSlug}
                  onChange={(e) =>
                    setOrgSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in your URL: frogstats.io/{orgSlug}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  className="w-full"
                  onClick={handleOrganizationSubmit}
                  disabled={isLoading || !orgName || !orgSlug}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <AppWindow className="h-6 w-6" />
              Add your first website
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Website Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com or sub.example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the domain of the website you want to track
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  className="w-full"
                  onClick={handleWebsiteSubmit}
                  disabled={isLoading || !domain}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Code className="h-6 w-6" />
              Add tracking code to your website
            </h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium">Your account is ready!</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  To start collecting analytics data, add this tracking code to
                  your website.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  Place this snippet in the &lt;head&gt; of your website
                </Label>
                <CodeSnippet
                  language="HTML"
                  code={`<script\n    src="${BACKEND_URL}/script.js"\n    site-id="${siteId}"\n    defer\n/>`}
                />
              </div>

              <div className="rounded-lg bg-muted p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  Once you've added the tracking code, it may take a few minutes
                  for data to appear in your dashboard.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => router.push("/")} variant="success">
                  Go to Dashboard
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <StandardPage>
      <div className="flex justify-center items-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl p-0 overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left sidebar with steps */}
            <div className="bg-muted md:w-80 p-6">
              <div className="flex flex-col space-y-4">
                <h1 className="text-xl font-bold mb-6">
                  Get Started with Frogstats
                </h1>

                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center space-x-3 py-2 ${
                      currentStep === step
                        ? "text-primary font-medium"
                        : currentStep > step
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    <div
                      className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }
                  `}
                    >
                      {currentStep > step ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span>
                      {step === 1 && "Create account"}
                      {step === 2 && "Create organization"}
                      {step === 3 && "Add website"}
                      {step === 4 && "Track your first pageview"!}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right content area */}
            <div className="p-6 md:p-8 flex-1 h-[600px] flex flex-col">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div className="min-h-[400px]">{renderStepContent()}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </StandardPage>
  );
}
