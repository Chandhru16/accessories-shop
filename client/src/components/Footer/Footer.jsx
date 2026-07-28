import "./Footer.css";
const WEXA_WEBSITE_URL = "https://wexainfote.netlify.app/";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-note">This website was built by</p>
        <div className="footer-brand">
          <img src="/wexa-logo.png" alt="Wexa Infotech logo" className="footer-logo" />
          <div>
            <h3>Wexa Infotech</h3>
            <p>Websites, e-commerce stores & custom web apps</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="mailto:wexainfotech@gmail.com">wexainfotech@gmail.com</a>
          <a href={WEXA_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
            Visit our website
          </a>
        </div>
        <p className="footer-cta">Want a website like this for your business? Get in touch.</p>
      </div>
    </footer>
  );
};

export default Footer;
