import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Disclaimer = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-[#0d3863] mb-4">Disclaimer</h2>
    <h3 className="text-lg font-semibold text-gray-800">General</h3>
    <p className="text-gray-600 leading-relaxed">
      This website and its contents herein are provided as a convenience to you on "as is" basis in good faith. Techhansa Retail does not warrant that its website shall either be error-free or that it shall be available on uninterrupted basis. Techhansa Retail does not accept any warranty or claims whatsoever whether explicit or implied for the material presented or for the usage of or reference to the material presented on this website. Techhansa Retail reserves the right to revise the pages or withdraw access to them at any time.
    </p>
    <h3 className="text-lg font-semibold text-gray-800">Products and services</h3>
    <p className="text-gray-600 leading-relaxed">
      The information on the company's products and services presented herein, while true and accurate to the best of our knowledge, is provided in good faith and on "as is" basis. Techhansa Retail does not warranty or guarantee whether explicitly or in any manner implied, the accuracy of such information.
    </p>
    <p className="text-gray-600 leading-relaxed">
      This information is not intended to be all-inclusive and complete. The visitor should confirm the conditions of use, handling, storage and other factors that may be involved or additional safety or performance considerations directly from the company's product teams or from other literature such as technical data sheets or MSDS. Techhansa Retail does not accept any responsibility or liability whatsoever on account of the above on the basis of the information provided in the website.
    </p>
    <p className="text-gray-600 leading-relaxed">
      No information provided in this website shall be construed as a recommendation to infringe any existing patents or to violate any laws in force.
    </p>
  </div>
);

const Copyright = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-[#0d3863] mb-4">Copyright</h2>
    <p className="text-gray-600 leading-relaxed">
      By accessing Techhansa Retail website you agree to the following copyright requirements. If you do not agree to the following terms, you may be liable to remedies for infringement of Techhansa Retail copyrights.
    </p>
    <p className="text-gray-600 leading-relaxed">
      The contents of Techhansa Retail website are the copyright of Techhansa Retail as created in 2002. Any rights not expressly granted herein are reserved. Reproduction, transfer, distribution, or storage of part or all of the contents in any form without the prior written permission of Techhansa Retail is prohibited except in accordance with the following terms:
    </p>
    <p className="text-gray-600 leading-relaxed">
      Techhansa Retail consents to you browsing Techhansa Retail website on your computer or printing copies of extracts from these pages for your personal use only and not for redistribution unless consented to in writing by Techhansa Retail.
    </p>
    <p className="text-gray-600 leading-relaxed">
      Material from individual pages in our website may be subject to additional terms &amp; conditions as indicated in those documents.
    </p>
    <p className="text-gray-600 leading-relaxed">
      The use of this website and the content therein, is permitted for private, non-commercial use. The use of press releases and other public documents is permitted for public communication provided the source for the information has been expressly stated. Techhansa Retail however takes no responsibility or liability on account of accuracy of such documents or reference or for its usage.
    </p>
    <p className="text-gray-600 leading-relaxed">
      This website and its contents herein are provided as a convenience to you on "as is" basis in good faith. Techhansa Retail does not warrant that its website shall be error-free or that it shall be available on uninterrupted basis. Techhansa Retail does not accept any warranty or claims whatsoever whether explicit or implied for the material presented or for the usage or reference to of such material as present on this website. Techhansa Retail reserves the right to revise the pages or withdraw access to them at any time.
    </p>
  </div>
);

const PrivacyPolicy = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-[#0d3863] mb-4">Privacy Policy</h2>
    <p className="text-gray-600 leading-relaxed">
      Welcome to the Techhansa Retail website.
    </p>
    <p className="text-gray-600 leading-relaxed">
      We at Techhansa Retail are committed to maintaining the privacy and security of the Personal Information of all the visitors to this website. If you do not agree with this Privacy Policy, please do not use this site. By accessing and using this site, you consent to the terms of this Privacy Policy.
    </p>
    <h3 className="text-lg font-semibold text-gray-800">At this website</h3>
    <p className="text-gray-600 leading-relaxed">
      Techhansa Retail does not actively initiate any collection of any visitor's individual information. We passively receive information that is automatically sent to us by your web browser. This information typically includes your domain name (the site after the @ in your e-mail address). It may also contain your user name (the name before the @ in your e-mail address). The amount of information sent depends on the settings you have on your web browser; please refer to your browser if you want to learn what information it sends. We however do not actively seek to identify any individual visitor, with the exception of investigating security breaches or cooperating with authorities pursuant to a legal matter.
    </p>
    <p className="text-gray-600 leading-relaxed">
      Techhansa Retail will not use or share, either within Techhansa Retail or with a third party, any information collected at this page for direct marketing purposes. The information we automatically receive from your web browser is used to see which pages you visit within our site, which site you visited before coming to ours, and where you go after you leave. We at Techhansa Retail can then develop statistics that are helpful to understanding how our visitors use our site. This statistical data is interpreted by Techhansa Retail in its continuing effort to present the website content that visitors are seeking in a format they find most helpful.
    </p>
    <p className="text-gray-600 leading-relaxed">
      If you register with one of Techhansa Retail's business units online, they may use this information to provide you with custom information in support of your business needs. A technology called cookies may be used to provide you with tailored information. A cookie is a tiny element of data that a Web site can send to your browser, which may then be stored on your hard drive so we can recognize you when you return. You may set your browser to notify you when you receive a cookie.
    </p>
    <p className="text-gray-600 leading-relaxed">
      When you e-mail us, you voluntarily release information of personal nature to us. Your e-mail address will be used by Techhansa Retail to respond to you. We will however not actively seek to collect or use the information that you have sent to us that can identify you, such as your e-mail address, for direct marketing purposes.
    </p>
    <p className="text-gray-600 leading-relaxed">
      For your convenience, this site may contain certain hyperlinks to other Techhansa Retail sites as well as to websites outside Techhansa Retail. While we at Techhansa Retail have posted an appropriate Privacy Policy statement throughout our website, we can not guarantee the same on the hyperlinked pages and sites that are not owned by Techhansa Retail. We, therefore, recommend that you carefully read the privacy policy/statement for each site you visit.
    </p>
    <p className="text-gray-600 leading-relaxed">
      We may change this Privacy Policy, change, modify or withdraw access to this website, and/or the content of these pages at any time without notice.
    </p>
    <p className="text-gray-600 leading-relaxed">
      If you require any clarifications on the use of your Personal Information by Techhansa Retail, please contact us at dscl@dscl.com, with the subject line, "privacy."
    </p>
  </div>
);

const Policies = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when loaded
    window.scrollTo(0, 0);
    // Support routing to a specific tab via hash
    if (location.hash === '#disclaimer') setActiveTab('disclaimer');
    else if (location.hash === '#copyright') setActiveTab('copyright');
    else if (location.hash === '#privacy') setActiveTab('privacy');
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-100 p-6 flex flex-col space-y-2 border-r border-gray-200">
            <h3 className="text-xl font-bold text-[#0d3863] mb-4">Legal Policies</h3>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'privacy' ? 'bg-[#0d3863] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActiveTab('disclaimer')}
              className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'disclaimer' ? 'bg-[#0d3863] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Disclaimer
            </button>
            <button 
              onClick={() => setActiveTab('copyright')}
              className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'copyright' ? 'bg-[#0d3863] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              Copyright
            </button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 p-8 md:p-12">
            {activeTab === 'privacy' && <PrivacyPolicy />}
            {activeTab === 'disclaimer' && <Disclaimer />}
            {activeTab === 'copyright' && <Copyright />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
