import { Shield, Heart, Ban, AlertTriangle } from "lucide-react";

export function GuidelinesSection() {
  const guidelines = [
    {
      icon: Heart,
      title: "Be Respectful",
      description: "Treat others with kindness and empathy. Remember there are real people behind every confession."
    },
    {
      icon: Shield,
      title: "Stay Anonymous",
      description: "Your identity is protected. Never share personal information that could identify yourself or others."
    },
    {
      icon: Ban,
      title: "No Hate Speech",
      description: "Discriminatory content, harassment, or bullying will not be tolerated. Keep the community safe for everyone."
    },
    {
      icon: AlertTriangle,
      title: "Report Issues",
      description: "If you see inappropriate content, please report it. Help us maintain a positive community."
    }
  ];

  return (
    <section id="guidelines" className="py-20 bg-[#0f0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-white mb-4 text-3xl">
            Community Guidelines
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Bath Confessions is a space for honest, anonymous sharing. Please follow these guidelines to keep our community safe and welcoming.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-white mb-2">
                  {guideline.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {guideline.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#1a1a24] border border-blue-500/20 rounded-2xl p-6">
          <p className="text-center text-gray-400 text-sm leading-relaxed">
            <span className="text-blue-400">Important:</span> This platform is for University of Bath students to share thoughts and experiences anonymously. 
            Please be mindful of what you share and always follow university policies and UK law.
          </p>
        </div>
      </div>
    </section>
  );
}
