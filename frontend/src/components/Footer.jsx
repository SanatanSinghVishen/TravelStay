import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.1 * i
      }
    })
  };

  const socials = [
    {
      name: 'GitHub',
      url: 'https://github.com/SanatanSinghVishen',
      hoverBg: '#ffffff',
      hoverColor: '#000000',
      svg: <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sanatan-singh-55b3502a3/',
      hoverBg: '#0A66C2',
      hoverColor: '#ffffff',
      svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    },
    {
      name: 'X',
      url: 'https://x.com/sanatan_152',
      hoverBg: '#000000',
      hoverColor: '#ffffff',
      svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    }
  ];

  return (
    <footer style={{
      background: '#111111',
      color: 'rgba(255,255,255,0.7)',
      padding: '80px 0 32px 0',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div className="footer-grid" style={{
          display: 'grid',
          gap: '40px',
          marginBottom: '64px'
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link to="/" style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '1.6rem', 
              color: '#ffffff',
              fontWeight: 600
            }}>
              TravelStay
            </Link>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: '280px' }}>
              Real homes. Real hosts. Real experiences.
            </p>
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>Explore</h4>
            {['All Stays', 'City Escapes', 'Mountain Retreats', 'Beach Stays', 'Heritage Homes'].map(link => (
              <Link key={link} to="/listings" className="footer-link">
                {link}
              </Link>
            ))}
          </div>

          {/* Column 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>Company</h4>
            {['About', 'How it works', 'Become a Host', 'Contact', 'Privacy Policy'].map(link => (
              <Link key={link} to="#" className="footer-link">
                {link}
              </Link>
            ))}
          </div>

          {/* Column 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>Developer</h4>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>
              Sanatan Singh
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {socials.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={socialVariants}
                  className="social-btn"
                  aria-label={social.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    color: '#ffffff'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = social.hoverBg;
                    e.currentTarget.style.color = social.hoverColor;
                    e.currentTarget.style.borderColor = social.hoverBg;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    {social.svg}
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--text-xs)',
          opacity: 0.6
        }}>
          <span>© 2025 TravelStay. All rights reserved.</span>
          <span>Made with care in India</span>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
          }
        }
        .footer-link {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.7);
          transition: all 0.15s ease;
          display: inline-block;
          width: fit-content;
        }
        .footer-link:hover {
          color: #ffffff;
          transform: translateX(4px);
        }
      `}</style>
    </footer>
  );
}
