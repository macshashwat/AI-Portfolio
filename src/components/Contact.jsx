import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'shashwatmishra717@gmail.com',
      link: 'mailto:shashwatmishra717@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Mumbai, India',
      link: 'https://www.google.com/maps/place/Mumbai'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulating an API call for email sending
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store in localStorage as per initial implementation requirements
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      messages.push({
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      });
      localStorage.setItem('contact_messages', JSON.stringify(messages));

      toast({
        title: "Message Sent Successfully!",
        description: "Thanks for reaching out. I'll get back to you soon.",
        variant: "default",
        className: "bg-green-500 text-white border-none"
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Get In <span className="text-green-500">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              className="min-w-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6">Let's work together!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <item.icon className="shrink-0 text-green-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="min-w-0 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none`}
                    placeholder="Your Name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none`}
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none`}
                    placeholder="Project Inquiry"
                    disabled={isSubmitting}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none`}
                    placeholder="Tell me about your project..."
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;