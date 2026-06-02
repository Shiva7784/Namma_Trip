import logo from "../../assets/clogo.png"; // Assuming you have a logo to display
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-blue-400 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Quick Links Section */}
          <div className="flex flex-col justify-between text-center h-full">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 mb-4">
              {['About Us', 'Tour Packages', 'Destinations', 'Equipment', 'Blogs', 'Contact'].map((item) => {
                const links = {
                  'About Us': '/about',
                  'Tour Packages': '/tour-packages',
                  'Destinations': '/destinations',
                  'Equipment': '/userequipment',
                  'Blogs': '/blogs',
                  'Contact': '/tickets'
                };

                return (
                  <li key={item}>
                    <a href={links[item]} className="hover:text-orange-300 transition duration-300">
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>

          </div>

          {/* Center Section for Ceylon Odyssey */}
          <div className="flex flex-col justify-between h-full text-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Bucket List</h3>
              <p className="mb-4">Karnataka is not just a place, it's a feeling. Let's celebrate its beauty and unity.</p>
              <img src={logo} alt="Ceylon Odyssey Logo" className="h-12 mb-4 mx-auto" />
            </div>
            <p className="text-sm mt-auto">© {new Date().getFullYear()} Bucket List. All Rights Reserved.</p>
          </div>

          {/* Legal Section with Social Icons Aligned to Bottom */}
          <div className="flex flex-col justify-between ml-10 pl-10">
            <div>
              <h4 className="text-xl font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 mb-4">
                {['Terms & Conditions', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-orange-300 transition duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Social Icons aligned to the bottom */}
            <div className="self-left mt-auto ">
              <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-6">
                {[
                  { icon: <FaFacebookF />, name: 'Facebook' },
                  { icon: <FaTwitter />, name: 'Twitter' },
                  { icon: <FaInstagram />, name: 'Instagram' },
                  { icon: <FaYoutube />, name: 'YouTube' },
                  { icon: <FaLinkedin />, name: 'LinkedIn' },
                ].map(({ icon, name }) => (
                  <a key={name} href="#" className="text-3xl hover:text-orange-300 transition duration-300">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
