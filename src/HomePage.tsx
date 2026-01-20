
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Zap, 
  ArrowRight,
  Printer,
  Compass,
  Ruler,
  Brain,
  Sparkles,
  ShieldCheck,
  Smartphone,
  QrCode,
  Phone,
  Box,
  BookOpen
} from 'lucide-react';
import { getProjectIdea } from '../services/geminiService';

export default function HomePage() {
  const [interest, setInterest] = useState('');
  const [aiIdea, setAiIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevelForAi, setSelectedLevelForAi] = useState('LEVEL 1 (EXPLORER)');

  const levels = [
    {
      id: 1,
      tag: 'LEVEL 1',
      name: 'EXPLORER',
      price: '$145 + HST',
      sessions: '3 Sessions',
      description: 'Discover how 3D printers work, explore 3D pens, and build your own STEM creation!',
      icon: <Compass className="w-8 h-8 text-emerald-500" />,
      color: 'border-emerald-500 bg-emerald-50/30',
      badge: 'bg-emerald-500'
    },
    {
      id: 2,
      tag: 'LEVEL 2',
      name: 'APPRENTICE',
      price: '$185 + HST',
      sessions: '3 Sessions',
      description: 'Learn 3D CAD modeling. Design your own personalized gear - customized keychain, name tag, or organizer.',
      icon: <Ruler className="w-8 h-8 text-blue-500" />,
      color: 'border-blue-500 bg-blue-50/30',
      badge: 'bg-blue-500'
    },
    {
      id: 3,
      tag: 'LEVEL 3',
      name: 'AI PRO INVENTOR',
      price: '$225 + HST',
      sessions: '3 Sessions',
      description: 'The cutting edge! Use AI to generate 3D models and print complex inventions.',
      icon: <Brain className="w-8 h-8 text-red-500" />,
      color: 'border-red-500 bg-red-50/30',
      badge: 'bg-red-500'
    }
  ];

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest) return;
    setIsLoading(true);
    const idea = await getProjectIdea(interest, selectedLevelForAi);
    setAiIdea(idea);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold mb-8 uppercase tracking-widest">
            <Zap className="w-4 h-4 text-yellow-400 fill-current" />
            Ages 8–15 | Boutique AI & 3D Printing Studio
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            DESIGN THE <span className="gradient-text">FUTURE:</span> <br />
            AI & 3D PRINTING
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-600 max-w-3xl mx-auto mb-12 font-medium">
            Transform Your Ideas into Reality – <span className="text-slate-900 font-bold">3D Design & Printing Classes for Youngs with AI</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-bold">Micro-Groups: Max 4 Students</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">Eco-Friendly PLA Materials</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Levels */}
      <section id="levels" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Choose Your Level</h2>
            <p className="text-slate-500 text-lg">Boutique 3-Session Level Packs for Maximum Mastery.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {levels.map((level) => (
              <Link 
                to={`/level/${level.id}`} 
                key={level.id}
                className="block group"
              >
                <div className={`relative p-8 rounded-[2.5rem] border-4 transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full bg-white cursor-pointer ${level.color}`}>
                  <div className="absolute -top-5 left-8">
                    <span className={`${level.badge} text-white px-4 py-1.5 rounded-full text-sm font-black tracking-widest`}>
                      {level.tag}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start mb-6 pt-2">
                    <div className="p-4 bg-white rounded-2xl shadow-sm">
                      {level.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-slate-900">{level.price}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">{level.sessions}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-4">{level.name}</h3>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow italic">
                    {level.description}
                  </p>

                  <div className="pt-6 border-t border-slate-200/50">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Zap className="w-4 h-4 text-yellow-500" /> 1-on-1 Mentorship
                      </li>
                      <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Zap className="w-4 h-4 text-yellow-500" /> Take Home Creations
                      </li>
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Lab Helper */}
      <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block p-4 bg-blue-500/20 rounded-3xl border border-blue-500/30 mb-8">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 italic">The AI Pro Lab</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Curious about what you'll build? Our Lab Assistant uses Gen-AI to suggest futuristic projects based on your child's interests!
          </p>

          <form onSubmit={handleAiAsk} className="flex flex-col md:flex-row gap-4 mb-10">
            <select 
              value={selectedLevelForAi}
              onChange={(e) => setSelectedLevelForAi(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map(l => <option key={l.id}>{l.tag} ({l.name})</option>)}
            </select>
            <input 
              type="text" 
              placeholder="What does your child love? (e.g. Dragons, Space, Minecraft)"
              className="flex-grow bg-slate-800 border-slate-700 text-white p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isLoading || !interest}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-95"
            >
              {isLoading ? 'Processing...' : 'Generate Idea'}
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>

          {aiIdea && (
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-left animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-400 font-black tracking-widest text-sm uppercase">AI Design Suggestion</span>
              </div>
              <p className="text-xl md:text-2xl leading-relaxed text-slate-100 font-medium italic">
                "{aiIdea}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-16 text-center uppercase tracking-widest">Why Our Boutique Studio?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <Users className="w-7 h-7 text-orange-600 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-black mb-3">Micro-Groups</h4>
              <p className="text-slate-500 leading-relaxed font-medium">Max 4 students for real 1-on-1 mentorship. No crowds, just focus.</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Brain className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-black mb-3">AI Integration</h4>
              <p className="text-slate-500 leading-relaxed font-medium">We teach the latest Generative AI tools to future-proof design skills.</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Printer className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-black mb-3">Hands-On Results</h4>
              <p className="text-slate-500 leading-relaxed font-medium">Every student takes home their custom 3D printed inventions!</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <ShieldCheck className="w-7 h-7 text-red-600 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-black mb-3">Safety First</h4>
              <p className="text-slate-500 leading-relaxed font-medium">Non-toxic, eco-friendly PLA materials. Safe for kids & home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Registration */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <Link to="/registration" className="group cursor-pointer">
                <div className="transform transition-transform group-hover:scale-[1.02]">
                  <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">SCAN TO <br/><span className="gradient-text">REGISTER</span></h2>
                  <p className="text-slate-500 text-lg mb-10 font-medium italic">Limited Spots Available! <br /> Secure your child's future in the next-gen tech lab.</p>
                </div>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {/* WhatsAPP Card */}
                <div className="relative">
                  <div className="bg-slate-900 rounded-[3rem] p-8 text-white text-center aspect-square flex flex-col items-center justify-center border-8 border-slate-100 shadow-xl group">
                    <div className="bg-white p-4 rounded-3xl mb-6 transform group-hover:scale-110 transition-transform cursor-pointer">
                      <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden">
                        <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/14164078480" 
                            alt="WhatsAPP QR Code"
                            className="w-full h-full grayscale contrast-125"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-slate-900 p-2 rounded-xl border-4 border-white">
                              <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xl font-black mb-1 italic">SCAN WHATSAPP</h4>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Direct Registration</p>
                  </div>
                </div>

                {/* WeChat Card */}
                <div className="relative">
                  <div className="bg-slate-900 rounded-[3rem] p-8 text-white text-center aspect-square flex flex-col items-center justify-center border-8 border-slate-100 shadow-xl group">
                    <div className="bg-white p-4 rounded-3xl mb-6 transform group-hover:scale-110 transition-transform cursor-pointer">
                      <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden">
                        <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://u.wechat.com/EB_FUTUREBUILD_3D" 
                            alt="WeChat QR Code"
                            className="w-full h-full grayscale contrast-125"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-slate-900 p-2 rounded-xl border-4 border-white">
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xl font-black mb-1 italic">SCAN WECHAT</h4>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Direct Registration</p>
                  </div>
                </div>
                
                {/* Location Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white shadow-xl p-3 rounded-2xl border border-slate-100 flex items-center gap-2 hidden sm:flex">
                  <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xs">Erin Mills</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">Mississauga, ON</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-slate-400 font-medium" style={{ textAlign: 'center' }}>
             <p><Calendar className="w-4 h-4 text-slate-400 inline-block mr-2" /> Saturdays or After-School | <BookOpen className="w-4 h-4 text-slate-400 inline-block mr-2" /> 3-Session Level Packs | <Box className="w-4 h-4 text-slate-400 inline-block mr-2" /> Materials Included</p> 
          </div>
          
        </div>
      </section>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-100">
        <p>© 2024 Design The Future Studio. Empowering Mississauga's young inventors.</p>
      </footer>
    </div>
  );
}
