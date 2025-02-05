import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold gradient-text mb-4">ClassConnect</h3>
            <p className="text-gray-600">
              Experience seamless online learning with high-quality video conferencing and real-time collaboration.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/quizzes" className="text-gray-600 hover:text-primary">Quizzes</Link></li>
              <li><Link to="/schedule" className="text-gray-600 hover:text-primary">Schedule</Link></li>
              <li><Link to="/join" className="text-gray-600 hover:text-primary">Join Class</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                support@classconnect.com
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                123 Education St
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} ClassConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;