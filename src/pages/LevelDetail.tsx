import { useParams, Navigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Clock,
  Users,
  Laptop,
  CheckCircle2,
  Lock,
  CreditCard,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SessionCard from '../components/SessionCard';
import { getCourseById, STRIPE_CONFIG } from '../services/courseData';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publicKey);

export default function LevelDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || '1', 10);
  const course = getCourseById(courseId);

  // Redirect to home if course not found
  if (!course) {
    return <Navigate to="/" replace />;
  }

  const { theme } = course;

  // Handle Stripe Checkout
  const handleEnroll = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe failed to load');
        alert('Payment system is loading. Please try again.');
        return;
      }

      // Check if using placeholder
      if (course.stripePriceId.includes('PLACEHOLDER')) {
        alert(
          '⚠️ Stripe is not configured yet.\n\n' +
          'To enable payments:\n' +
          '1. Create products in Stripe Dashboard\n' +
          '2. Add your VITE_STRIPE_PUBLIC_KEY to environment variables\n' +
          '3. Update price IDs in courseData.ts'
        );
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: course.stripePriceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.href,
      });

      if (error) {
        console.error('Stripe error:', error);
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Unable to process payment. Please try again later.');
    }
  };

  // Scroll to sessions section
  const scrollToSessions = () => {
    document.getElementById('sessions')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Background images for each level
  const backgroundImages: Record<number, string> = {
    1: '/ideogram-v3.0_Create_level1.jpg',
    2: '/ideogram-v3.0_Create_level2.jpg',
    3: '/ideogram-v3.0_Create_level3.jpg',
  };

  const backgroundImageStyle = backgroundImages[courseId] ? {
    backgroundImage: `url(${backgroundImages[courseId]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  } : {};

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative"
      style={backgroundImageStyle}
    >
      {/* Background overlay for better text readability - 30% transparency (70% white overlay) */}
      {backgroundImages[courseId] && (
        <div className="fixed inset-0 bg-white/75 pointer-events-none z-0" />
      )}
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar levelTag={course.tag} levelName={course.name} theme={theme} />

        {/* Hero Section */}
        <section className={`relative overflow-hidden ${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Level Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${theme.badge}`}>
              {course.tag}
            </span>
            {course.needsLaptop && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                <Laptop className="w-3 h-3" />
                Laptop Recommended
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            {course.name}
          </h1>
          <p className={`text-lg sm:text-xl ${theme.text} font-medium mb-4`}>
            {course.fullName}
          </p>

          {/* Focus Statement */}
          <p className="text-gray-600 text-lg mb-6 max-w-2xl">
            <span className="font-semibold">Focus:</span> {course.focus}
          </p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-700">
              <span className={`w-8 h-8 rounded-full ${theme.bgSolid} flex items-center justify-center`}>
                <span className={`text-lg font-bold ${theme.text}`}>$</span>
              </span>
              <span className="font-semibold">{course.price} {course.currency}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className={`w-8 h-8 rounded-full ${theme.bgSolid} flex items-center justify-center`}>
                <Clock className={`w-4 h-4 ${theme.text}`} />
              </span>
              <span>{course.sessions.length} Sessions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className={`w-8 h-8 rounded-full ${theme.bgSolid} flex items-center justify-center`}>
                <Users className={`w-4 h-4 ${theme.text}`} />
              </span>
              <span>{course.ageRange}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={scrollToSessions}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-white transition-all flex items-center gap-2"
            >
              View Details
              <ChevronDown className="w-4 h-4" />
            </button>
            <Link
              to="/registration"
              className={`px-8 py-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2`}
            >
              <CreditCard className="w-5 h-5" />
              Enroll Now
            </Link>
          </div>
        </div>

          {/* Decorative Element */}
          <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full ${theme.badge} opacity-5`} />
        </section>

        {/* Description Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-lg text-gray-600 leading-relaxed">
            {course.description}
          </p>
        </section>

        {/* Sessions Section */}
        <section id="sessions" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className={`w-6 h-6 ${theme.text}`} />
            <h2 className="text-2xl font-bold text-gray-900">Course Sessions</h2>
          </div>
          <p className="text-gray-500 mb-6">
            Each session is {course.sessionDuration}. Click to expand and see details.
          </p>

          <div className="space-y-4">
            {course.sessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                theme={theme}
                defaultExpanded={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className={`w-6 h-6 ${theme.text}`} />
            Requirements
          </h2>
          <div className={`p-6 rounded-2xl ${theme.bg} border ${theme.borderLight}`}>
            <ul className="space-y-3">
              {course.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className={`w-5 h-5 mt-0.5 ${theme.text} flex-shrink-0`} />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ✨ What's Included?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {course.included.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enrollment CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className={`p-8 rounded-3xl bg-gradient-to-br ${theme.bg} border-2 ${theme.border}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                💳 Ready to Enroll?
              </h2>
              <p className="text-gray-600 mb-6">
                Join our {course.fullName} program and start your 3D printing journey!
              </p>

              <div className="inline-block p-6 rounded-2xl bg-white shadow-lg mb-6">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className={`text-4xl font-bold ${theme.textDark}`}>
                    ${course.price}
                  </span>
                  <span className="text-gray-500">{course.currency}</span>
                </div>
                <p className="text-gray-500 text-sm">
                  {course.sessions.length} Sessions • {course.sessionDuration}
                </p>
              </div>

              <Link
                to="/registration"
                className={`w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto`}
              >
                <Lock className="w-5 h-5" />
                Secure Checkout with Stripe
              </Link>

              <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </section>

        {/* Footer Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
