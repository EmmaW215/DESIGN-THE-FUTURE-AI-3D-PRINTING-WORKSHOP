import { Link } from 'react-router-dom';
import { CheckCircle2, Home, Mail, PartyPopper } from 'lucide-react';

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <PartyPopper className="w-8 h-8 mx-auto text-amber-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Enrollment Successful! 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for enrolling in our 3D Printing Workshop! 
          We're excited to have you join us on this creative journey.
        </p>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-500" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              Check your email for a confirmation receipt
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              You'll receive class schedule and location details within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              Prepare your curiosity and creativity!
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <p className="text-sm text-gray-500 mb-6">
          Questions? Email us at{' '}
          <a href="mailto:hello@3dworkshop.com" className="text-emerald-600 hover:underline">
            hello@3dworkshop.com
          </a>
        </p>

        {/* Back Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
