import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-luxury-silver">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-ibm-plex font-semibold text-text-primary mb-4">RJ GEMS</h3>
            <p className="text-sm text-luxury-charcoal/60 mb-4 leading-relaxed font-ibm-plex">
              Discover our collection of fine jewelry pieces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-ibm-plex font-semibold text-luxury-charcoal mb-3">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=rings" className="text-sm text-luxury-charcoal/60 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                  Rings
                </Link>
              </li>
              <li>
                <Link to="/?category=necklaces" className="text-sm text-luxury-charcoal/60 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link to="/?category=earrings" className="text-sm text-luxury-charcoal/60 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/?category=bracelets" className="text-sm text-luxury-charcoal/60 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-ibm-plex font-semibold text-luxury-charcoal mb-3">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-luxury-charcoal/40" />
                <span className="text-sm text-luxury-charcoal/60 font-ibm-plex">info@rjgems.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-luxury-charcoal/40" />
                <span className="text-sm text-luxury-charcoal/60 font-ibm-plex">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-luxury-silver mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-luxury-charcoal/50 font-ibm-plex">
              © 2024 RJ GEMS. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <button className="text-xs text-luxury-charcoal/50 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                Privacy
              </button>
              <button className="text-xs text-luxury-charcoal/50 hover:text-text-primary transition-colors duration-200 font-ibm-plex">
                Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 