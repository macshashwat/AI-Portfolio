import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Projects = () => {
  const { toast } = useToast();

  const projects = [
    {
      title: 'AI Voice Studio',
      description: 'The AI Voice Studio is a production-ready SaaS application built with Next.js 16 and Python for AI text-to-speech generation. It includes essential features like secure authentication, payment processing, real-time audio creation, and project management.',
      image: '/images/ai-voice-studio.png',
      tech: ['Next.js', 'Python', 'Neon DB', 'Polar', 'AWS S3', 'Tailwind CSS'],
      liveLink: 'https://ai-voice-studio-psi.vercel.app',
      githubLink: 'https://github.com/macshashwat/AI-Voice-Studio'
    },
    {
      title: 'AI Event Organiser',
      description: 'Spott is an advanced event organization platform for India, seamlessly powered by Gemini AI. We revolutionize the event experience with effortless ticket pre-booking and ultra-fast, secure access via QR code validation for seamless attendee onboarding.',
      image: '/images/ai-event-organiser-new.png',
      tech: ['Next.js', 'React', 'Convex', 'Gemini AI', 'Tailwind CSS'],
      liveLink: 'https://ai-event-organiser-xi.vercel.app',
      githubLink: 'https://github.com/macshashwat/AI-Event-Organiser'
    },
    {
      title: 'Talent IQ',
      description: 'Talent IQ is an interview practice platform with an integrated online IDE, and many features like 1 on 1 video interview, real time chat messaging, screen sharing and many more.',
      image: '/images/talent-iq-new.png',
      tech: ['Javascript', 'Tailwind CSS', 'MongoDB', 'Node.js'],
      liveLink: 'https://talent-iq-production-8297.up.railway.app',
      githubLink: 'https://github.com/macshashwat/Talent-IQ'
    },
    {
      title: 'Real-Time Chat Application',
      description: 'A Zero-Trace, P2P preferred messaging application offering ephemeral 1 to 1 communication, secured with end to end encryption and featuring an integrated self-destruct mechanism that wipes all room keys and session data upon disconnection or inactivity.',
      image: '/images/real-time-chat.png',
      tech: ['Next.js', 'Redis', 'Tailwind CSS'],
      liveLink: 'https://realtime-chat-app-silk-six.vercel.app',
      githubLink: 'https://github.com/macshashwat/Realtime-Chat-App'
    },
    {
      title: 'AI Creator Platform CMS',
      description: 'AI Creator Platform CMS is an all-in-one content management solution that leverages AI to streamline writing, audience engagement, and analytics for creators. Effortlessly manage, optimize, and grow your content and community in one platform.',
      image: '/images/ai-creator-platform-cms-new.png',
      tech: ['React', 'Next.js', 'Convex', 'Tailwind CSS', 'Gemini AI'],
      liveLink: 'https://ai-creator-platform-cms.vercel.app',
      githubLink: 'https://github.com/macshashwat/AI-creator-platform-CMS'
    },
    {
      title: 'AI News Aggregator',
      description: 'An intelligent news aggregation system that scrapes AI-related content from multiple sources (YouTube channels, RSS feeds), processes them with LLM-powered summarization, curates personalized digests based on user preferences, and delivers daily email summaries.',
      image: '/images/ai-news-aggregator-updated.png',
      tech: ['Python', 'PostgreSQL', 'Open AI', 'Pydantic', 'RSS parsing'],
      liveLink: 'https://github.com/macshashwat/AI-news-aggregator',
      githubLink: 'https://github.com/macshashwat/AI-news-aggregator'
    }
  ];

  const handleLinkClick = (url) => {
    if (!url || url === '#') {
      toast({
        title: "🚧 Feature Not Available",
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="projects" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            My <span className="text-green-500">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden aspect-video h-auto">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={project.title}
                    src={project.image} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 rounded-full"
                      onClick={() => handleLinkClick(project.liveLink)}
                    >
                      <ExternalLink size={20} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-200"
                      onClick={() => handleLinkClick(project.githubLink)}
                    >
                      <Github size={20} />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;