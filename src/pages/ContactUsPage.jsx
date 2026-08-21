import React from 'react';
import Container from '../components/Container';
import { SparklesIcon } from '../assets/icons/icons';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const ContactUsPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(data.get('subject') || 'Orderly Inquiry');
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    window.location.href = `mailto:contact@orderly.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-100 py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-base-200 shadow-xs text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-base-content tracking-tight mb-3">
              Contact Orderly
            </h1>
            <p className="font-body text-base text-neutral max-w-xl mx-auto">
              Have questions, feedback, or need help with a group order space? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs">
              <h2 className="font-heading text-2xl font-bold text-base-content mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  label="Your Name"
                  name="name"
                  placeholder="Alex Morgan"
                  required
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  required
                />
                <FormInput
                  label="Subject"
                  name="subject"
                  placeholder="Question about group ordering"
                  required
                />
                <div>
                  <label className="label text-xs font-semibold text-base-content">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="textarea textarea-bordered w-full rounded-xl text-xs bg-base-100"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 rounded-xl font-bold text-sm shadow-xs mt-2"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Sidebar Details */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs">
                <h3 className="font-heading text-xl font-bold text-base-content mb-4">
                  Direct Contact
                </h3>
                <div className="space-y-3 text-xs font-body text-neutral">
                  <p>
                    <strong className="text-base-content font-semibold block mb-0.5">Email Support:</strong>
                    <a href="mailto:contact@orderly.com" className="text-primary hover:underline font-mono">
                      contact@orderly.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-base-content font-semibold block mb-0.5">Phone:</strong>
                    <span className="font-mono">+2 123 456 7890</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs">
                <h3 className="font-heading text-xl font-bold text-base-content mb-3">
                  Development Team
                </h3>
                <p className="text-xs text-neutral mb-3">
                  Crafted by Team 4A for seamless group dining collaboration:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-base-content">
                  <div className="p-2.5 bg-base-200/50 rounded-xl">Ahmed Gamal</div>
                  <div className="p-2.5 bg-base-200/50 rounded-xl">Ahmed Yasser</div>
                  <div className="p-2.5 bg-base-200/50 rounded-xl">Ahmed Bakr</div>
                  <div className="p-2.5 bg-base-200/50 rounded-xl">Ahmed Adel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactUsPage;
