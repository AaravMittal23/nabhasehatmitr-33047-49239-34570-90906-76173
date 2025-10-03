import { useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";
interface ContactFormData {
  fullName: string;
  phone: string;
  queryType: string;
  message: string;
}
export default function ContactUs() {
  const {
    currentLanguage,
    changeLanguage
  } = useLanguage();
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const form = useForm<ContactFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      queryType: "",
      message: ""
    }
  });
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    try {
      const response = await fetch("https://backend-sih-v1au.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setShowSuccess(true);
        form.reset();
        toast({
          title: "Message sent successfully!",
          description: "We will reply within 48 hours."
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setShowError(true);
      toast({
        title: "Failed to send message",
        description: "Please try again or email us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEmailClick = () => {
    window.open("mailto:contact@healthconnect.com", "_blank");
  };
  return <div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} showCenterLogo={true} />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-montserrat">
              Contact Us
            </h1>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Form */}
            <div>
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary font-montserrat">
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showSuccess && <div className="mb-6 p-4 bg-healthcare-green/10 border border-healthcare-green/20 rounded-lg flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-healthcare-green" />
                      <p className="text-healthcare-green font-medium">
                        Thanks — your message has been sent. We will reply within 48 hours.
                      </p>
                    </div>}

                  {showError && <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive font-medium mb-3">
                        Contact service is temporarily unavailable. Please email us at contact@healthconnect.com
                      </p>
                      <Button onClick={handleEmailClick} className="bg-primary hover:bg-primary/90 text-white">
                        Send Email
                      </Button>
                    </div>}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Full Name */}
                      <FormField control={form.control} name="fullName" rules={{
                      required: "Full name is required"
                    }} render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-primary font-medium">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />

                      {/* Phone */}
                      <FormField control={form.control} name="phone" rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number"
                      }
                    }} render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-primary font-medium">Phone</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                                  <span className="text-sm text-muted-foreground">+91</span>
                                </div>
                                <Input type="tel" placeholder="1234567890" className="rounded-l-none" maxLength={10} {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />

                      {/* Type of Query */}
                      <FormField control={form.control} name="queryType" rules={{
                      required: "Please select a query type"
                    }} render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-primary font-medium">Type of Query</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select query type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="medical">Medical query</SelectItem>
                                <SelectItem value="technical">Technical issue</SelectItem>
                                <SelectItem value="feedback">Feedback / Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>} />

                      {/* Message */}
                      <FormField control={form.control} name="message" rules={{
                      required: "Message is required"
                    }} render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-primary font-medium">Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Please provide details about your query or concern..." className="min-h-[120px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />

                      {/* Submit Button */}
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium">
                        {isSubmitting ? "Sending..." : "Submit Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary font-montserrat">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-healthcare-green" />
                    <div>
                      <p className="font-medium text-primary">Mahathi T </p>
                      <p className="text-muted-foreground">9949645198</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-healthcare-green" />
                    <div>
                      <p className="font-medium text-primary">Dhruv Pratap Singh</p>
                      <p className="text-muted-foreground">9513731600</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-healthcare-green" />
                    <div>
                      <p className="font-medium text-primary">Email</p>
                      <p className="text-muted-foreground">Daamn32322@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-healthcare-green" />
                    <div>
                      <p className="font-medium text-primary">Address</p>
                      <p className="text-muted-foreground">Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card className="shadow-lg border-2 bg-accent/30">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    For emergencies, use the Emergency button in the header. For non-urgent queries, 
                    send a message via this form and we will respond within 48 hours.
                  </p>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <h4 className="font-semibold text-primary mb-2">What to include</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Patient name, problem summary, and a contact phone</li>
                      <li>• If you have reports, mention it and we will ask how to upload</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Nabha Sehat Mitr" className="h-10 w-10 object-contain" />
                <h3 className="text-xl font-bold">
                  <span className="text-primary">Nabha</span>
                  <span className="text-healthcare-green">Sehat</span>
                  <span className="text-medical-red">Mitr</span>
                </h3>
              </div>
              <p className="text-sm text-black leading-relaxed">
                Your trusted healthcare companion, providing quality medical services 
                and support for the people of Nabha and Punjab.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Quick Links</h4>
              <div className="space-y-2">
                <a href="/contact" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Contact Us
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Terms & Conditions
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Help & Support
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">+91 87977 60111, +91 95137 31600</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">daamn32322@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">Chennai, Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-muted-foreground/20 mt-12 pt-8">
            <div className="text-center text-sm text-black">
              <p>&copy; 2025 HealthConnect. All rights reserved. | Providing quality healthcare services.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}