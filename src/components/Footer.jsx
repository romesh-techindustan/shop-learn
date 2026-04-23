import facebookIcon from "../assets/Icon-Facebook.svg";
import linkedinIcon from "../assets/Icon-Linkedin.svg";
import instagramIcon from "../assets/icon-instagram.svg";
import twitterIcon from "../assets/Icon-Twitter.svg";
import "./Footer.css";

function FooterLink({ children }) {
    return (
        <button className="footer__link" type="button">
            {children}
        </button>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="app-shell__container footer__grid">
                <section className="footer__column">
                    <h2 className="footer__brand">Exclusive</h2>
                    <h3>Subscribe</h3>
                    <p>Get 10% off your first order</p>
                    <label className="footer__subscribe">
                        <span className="footer__sr-only">
                            Enter your email
                        </span>
                        <input placeholder="Enter your email" type="email" />
                        <button type="button">➜</button>
                    </label>
                </section>

                <section className="footer__column">
                    <h3>Support</h3>
                    <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
                    <p>exclusive@gmail.com</p>
                    <p>+88015-88888-9999</p>
                </section>

                <section className="footer__column">
                    <h3>Account</h3>
                    <FooterLink>My Account</FooterLink>
                    <FooterLink>Login / Register</FooterLink>
                    <FooterLink>Cart</FooterLink>
                    <FooterLink>Wishlist</FooterLink>
                    <FooterLink>Shop</FooterLink>
                </section>

                <section className="footer__column">
                    <h3>Quick Link</h3>
                    <FooterLink>Privacy Policy</FooterLink>
                    <FooterLink>Terms Of Use</FooterLink>
                    <FooterLink>FAQ</FooterLink>
                    <FooterLink>Contact</FooterLink>
                </section>

                <section className="footer__column">
                    <h3>Download App</h3>
                    <p className="footer__note">
                        Save $3 with App New User Only
                    </p>
                    <div className="footer__download">
                        <div className="footer__qr" />
                        <div className="footer__store-badges">
                            <div className="footer__store-badge">
                                <span className="footer__store-badge-label">
                                    GET IT ON
                                </span>
                                <strong>Google Play</strong>
                            </div>
                            <div className="footer__store-badge">
                                <span className="footer__store-badge-label">
                                    Download on the
                                </span>
                                <strong>App Store</strong>
                            </div>
                        </div>
                    </div>

                    <div className="footer__socials">
                        <button aria-label="Facebook" type="button">
                            <img alt="Facebook" src={facebookIcon} />
                        </button>
                        <button aria-label="Twitter" type="button">
                            <img alt="Twitter" src={twitterIcon} />
                        </button>
                        <button aria-label="Instagram" type="button">
                            <img alt="Instagram" src={instagramIcon} />
                        </button>
                        <button aria-label="LinkedIn" type="button">
                            <img alt="LinkedIn" src={linkedinIcon} />
                        </button>
                    </div>
                </section>
            </div>

            <div className="footer__bottom">
                <div className="app-shell__container">
                    © Copyright Rimel 2022. All right reserved
                </div>
            </div>
        </footer>
    );
}

export default Footer;
