import { Link } from '@remix-run/react';
import { 
  BookOpenIcon, 
  UsersIcon, 
  BattleAxeIcon, 
  SparklesIcon, 
  MapIcon, 
  DiceIcon 
} from '~/components/Icons'; // We'll create this icon component

export default function Index() {
  const features = [
    {
      title: "Campaign Management",
      description: "Create, track, and manage epic D&D campaigns with ease",
      icon: MapIcon,
      link: "/campaigns",
      status: "available"
    },
    {
      title: "Character Creation",
      description: "Craft detailed characters with advanced builder tools",
      icon: UsersIcon,
      link: "/characters",
      status: "coming-soon"
    },
    {
      title: "Encounter Builder",
      description: "Design and simulate complex combat scenarios",
      icon: BattleAxeIcon,
      link: "/encounters",
      status: "coming-soon"
    },
    {
      title: "Spell Synergies",
      description: "Explore magical interactions and combo potential",
      icon: SparklesIcon,
      link: "/spells/synergies",
      status: "available"
    },
    {
      title: "Rulebook & Lore",
      description: "Comprehensive D&D rules and world-building resources",
      icon: BookOpenIcon,
      link: "/rulebook",
      status: "coming-soon"
    },
    {
      title: "Dice Roller & Tools",
      description: "Advanced dice rolling and game management utilities",
      icon: DiceIcon,
      link: "/tools",
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <header className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          D&D Campaign Manager Pro
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-300 mb-8">
          Your ultimate companion for creating, managing, and experiencing epic Dungeons & Dragons adventures
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="/campaigns" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Start Your Adventure
          </a>
          <a 
            href="/about" 
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Learn More
          </a>
        </div>
      </header>

      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className={`
                p-6 rounded-lg shadow-lg transform transition-all duration-300 
                ${feature.status === 'available' 
                  ? 'bg-gray-800 hover:scale-105 hover:shadow-xl' 
                  : 'bg-gray-700 opacity-70 cursor-not-allowed'}
              `}
            >
              <div className="mb-4 text-4xl text-blue-400">
                <feature.icon className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              {feature.status === 'available' ? (
                <Link 
                  to={feature.link} 
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  Explore Feature
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </Link>
              ) : (
                <span className="text-gray-500">Coming Soon</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="container mx-auto px-6 py-12 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} D&D Campaign Manager Pro. 
          Unofficial tool for Dungeons & Dragons enthusiasts.
        </p>
      </footer>
    </div>
  );
}
