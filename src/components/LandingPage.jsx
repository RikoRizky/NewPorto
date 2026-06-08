import LandingPageDesktop from '../../LandingPage.png';
import LandingPageMobile from '../../Mobile.png';

const LandingPage = () => {
  return (
    <section className="relative h-screen w-full" id="beranda">
      <div className="absolute inset-0">
        <img
          src={LandingPageDesktop}
          alt="Landing Page"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={LandingPageMobile}
          alt="Landing Page Mobile"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">Riko Rizky</h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up">
            Turning ideas into interactive websites
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in-up">
            <a
              href="#biodata"
              className="px-8 py-3 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition duration-300 transform hover:scale-105"
            >
              About Me
            </a>
            <a
              href="#project"
              className="px-8 py-3 border-2 border-white text-yellow-400 rounded-full hover:bg-white hover:text-black transition duration-300 transform hover:scale-105"
            >
              My Projects
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#biodata" className="text-white text-4xl">
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>
    </section>
  );
};

export default LandingPage;
