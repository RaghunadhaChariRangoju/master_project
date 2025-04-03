
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  newsletter: z.boolean().default(false),
});

const Contact = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      newsletter: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real application, you would send this data to your backend
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-agBeige py-16 md:py-24">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-agBrown">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our products, 
              partnerships, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
        </div>

        {/* Contact Details & Form */}
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-agBrown">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  We're here to help and answer any question you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-agTerracotta/10 p-3 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-agTerracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Visit Us</h3>
                    <p className="text-muted-foreground mt-1">
                      Raghavendra Colony, Kondapur, 
                      <br />Hyderabad - 500084, 
                      <br />Telangana, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-agTerracotta/10 p-3 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-agTerracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Call Us</h3>
                    <p className="text-muted-foreground mt-1">+91 9014216285</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-agTerracotta/10 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-agTerracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email Us</h3>
                    <p className="text-muted-foreground mt-1">ag.sarithi@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-agTerracotta/10 p-3 rounded-lg mr-4">
                    <Clock className="h-6 w-6 text-agTerracotta" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Hours</h3>
                    <p className="text-muted-foreground mt-1">
                      Monday - Saturday: 10:00 AM - 7:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map or Image */}
              <div className="mt-8 rounded-lg overflow-hidden border border-muted h-64 md:h-80">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.9741357661864!2d78.3559249!3d17.459009700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc121a2aa7%3A0x17f0281e8f63d36f!2sRaghavendra%20Colony%2C%20Kondapur%2C%20Hyderabad%2C%20Telangana%20500084!5e0!3m2!1sen!2sin!4v1652424521132!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AG Handlooms Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 border border-muted">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-agBrown">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us what you're looking for..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-agBeige/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Subscribe to our newsletter
                          </FormLabel>
                          <FormDescription>
                            Get the latest news and offers from AG Handlooms.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-agTerracotta hover:bg-agTerracotta/90 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-agBeige/50 py-16 mt-20">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-center text-agBrown">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-agBrown">How long does shipping take?</h3>
                <p className="text-muted-foreground">For domestic orders, delivery typically takes 3-5 business days. International shipping may take 7-14 business days depending on the destination.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-agBrown">Do you offer customization?</h3>
                <p className="text-muted-foreground">Yes, we offer customization on select products. Please contact us directly with your requirements for a personalized quote.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-agBrown">What is your return policy?</h3>
                <p className="text-muted-foreground">We accept returns within 14 days of delivery. Items must be unused and in their original packaging. Please note that customized items cannot be returned.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-agBrown">How do I care for handloom products?</h3>
                <p className="text-muted-foreground">We recommend gentle hand washing in cold water with mild detergent. Avoid wringing, and air dry in shade. Iron at medium heat if needed.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
