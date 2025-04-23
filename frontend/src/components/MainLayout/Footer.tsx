import { Link } from 'react-router-dom';
import { FC } from 'react';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  showFullFooter?: boolean;
}

const FooterColumn: FC<FooterColumnProps> = ({ title, links }) => (
  <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 mb-8 md:mb-0">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          {link.isExternal ? (
            <a
              href={link.href}
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <Link
              to={link.href}
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: FC<FooterProps> = ({ showFullFooter = true }) => {
  const currentYear = new Date().getFullYear();

  const organizationLinks: FooterLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Mission', href: '/mission' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Events', href: '/events' },
    { label: 'News', href: '/news' },
  ];

  const membershipLinks: FooterLink[] = [
    { label: 'Join', href: '/register' },
    { label: 'Member Benefits', href: '/benefits' },
    { label: 'Membership Levels', href: '/membership-levels' },
    { label: 'Renew Membership', href: '/renew' },
  ];

  const resourceLinks: FooterLink[] = [
    { label: 'Alumni Directory', href: '/directory' },
    { label: 'Financial Resources', href: '/resources' },
    { label: 'Financial Planning', href: '/planning' },
    { label: 'FAQ', href: '/faq' },
  ];

  const legalLinks: FooterLink[] = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  const socialLinks = [
    { icon: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
    { icon: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
  ];

  // Simple footer for auth pages
  if (!showFullFooter) {
    return (
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {currentYear} Savio 96 Alumni Financial Hub. All rights
                reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Full footer for main application pages
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12">
          <div className="flex flex-col lg:flex-row mb-10">
            <div className="w-full lg:w-1/4 mb-8 lg:mb-0 pr-4">
              <div className="mb-6">
                <Link to="/" className="inline-block">
                  <h2 className="text-2xl font-bold text-blue-600">
                    Savio 96 Alumni
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Financial Hub</p>
                </Link>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Supporting alumni with financial tools, resources, and a strong
                community network.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={social.label}
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-3/4 flex flex-wrap">
              <FooterColumn title="Organization" links={organizationLinks} />
              <FooterColumn title="Membership" links={membershipLinks} />
              <FooterColumn title="Resources" links={resourceLinks} />
              <FooterColumn title="Legal" links={legalLinks} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {currentYear} Savio 96 Alumni Financial Hub. All rights
                reserved.
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">
                Designed By Megagig
              </span>
              <span className="text-red-500">❤</span>
              <span className="text-xs text-gray-500 ml-2">
                for the Class of '96
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social media icons component
const SocialIcon: FC<{ name: string }> = ({ name }) => {
  switch (name) {
    case 'facebook':
      return (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.67 20v-8.2H7V9.24h2.67v-2.2c0-2.56 1.6-3.84 3.94-3.84.8 0 1.6.08 2.4.16v2.64h-1.6c-1.28 0-1.52.56-1.52 1.44v1.8h3.04l-.4 2.56h-2.64V20h-3.2z"></path>
        </svg>
      );
    case 'twitter':
      return (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 6.28a7.15 7.15 0 0 1-2.06.56 3.58 3.58 0 0 0 1.57-1.98 7.15 7.15 0 0 1-2.28.87 3.58 3.58 0 0 0-6.1 3.26 10.17 10.17 0 0 1-7.4-3.74 3.56 3.56 0 0 0 1.11 4.77 3.57 3.57 0 0 1-1.62-.44v.04a3.58 3.58 0 0 0 2.87 3.51 3.55 3.55 0 0 1-1.61.06A3.59 3.59 0 0 0 8.12 15a7.19 7.19 0 0 1-5.28 1.48A10.13 10.13 0 0 0 8.67 18c7.22 0 11.17-5.98 11.17-11.17 0-.17 0-.34-.01-.51A7.96 7.96 0 0 0 22 4.33 7.81 7.81 0 0 1 20 6.28z"></path>
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.5 8.5h-3v10h3v-10zm1.5 10h3v-5.34c0-1.34.61-2.16 1.93-2.16 1.16 0 1.57.87 1.57 2.16V18.5h3v-5.97c0-2.63-1.4-3.94-3.4-3.94-1.54 0-2.47.79-3.1 1.83V9.5h-3v9zM6.5 3C5.12 3 4 4.12 4 5.5 4 6.88 5.12 8 6.5 8 7.88 8 9 6.88 9 5.5 9 4.12 7.88 3 6.5 3z"></path>
        </svg>
      );
    case 'instagram':
      return (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4.5c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S8.41 6 12 6s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm3.75-9c0 .41-.34.75-.75.75s-.75-.34-.75-.75.34-.75.75-.75.75.34.75.75zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
        </svg>
      );
    default:
      return null;
  }
};
