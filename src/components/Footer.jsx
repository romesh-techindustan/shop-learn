import facebookIcon from "../assets/Icon-Facebook.svg";
import linkedinIcon from "../assets/Icon-Linkedin.svg";
import instagramIcon from "../assets/icon-instagram.svg";
import twitterIcon from "../assets/Icon-Twitter.svg";
import "./Footer.css";

function FooterLink({ children }) {
    return (
        <button className="footerNavUrl" type="button">
            {children}
        </button>
    );
}

function Footer() {
    return (
        <footer className="pageFooter">
            <div className="appContainer footerLinksGrid">
                <section className="footerLinkColumn">
                    <h2 className="footerBrandSection">Exclusive</h2>
                    <h3>Subscribe</h3>
                    <p>Get 10% off your first order</p>
                    <label className="footerSubscribeForm">
                        <span className="footerVisuallyHidden">
                            Enter your email
                        </span>
                        <input placeholder="Enter your email" type="email" />
                        <button type="button">➜</button>
                    </label>
                </section>

                <section className="footerLinkColumn">
                    <h3>Support</h3>
                    <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
                    <p>exclusive@gmail.com</p>
                    <p>+88015-88888-9999</p>
                </section>

                <section className="footerLinkColumn">
                    <h3>Account</h3>
                    <FooterLink>My Account</FooterLink>
                    <FooterLink>Login / Register</FooterLink>
                    <FooterLink>Cart</FooterLink>
                    <FooterLink>Wishlist</FooterLink>
                    <FooterLink>Shop</FooterLink>
                </section>

                <section className="footerLinkColumn">
                    <h3>Quick Link</h3>
                    <FooterLink>Privacy Policy</FooterLink>
                    <FooterLink>Terms Of Use</FooterLink>
                    <FooterLink>FAQ</FooterLink>
                    <FooterLink>Contact</FooterLink>
                </section>

                <section className="footerLinkColumn">
                    <h3>Download App</h3>
                    <p className="footerNoteText">
                        Save $3 with App New User Only
                    </p>
                    <div className="footerAppDownloadApp">
                        <div className="footerAppQrCode" />
                        <div className="footerAppStoreBadges">
                            <div className="footerAppStoreBadge">
                                <span className="footerStoreBadgeLabel">
                                    GET IT ON
                                </span>
                                <strong>Google Play</strong>
                            </div>
                            <div className="footerAppStoreBadge">
                                <span className="footerStoreBadgeLabel">
                                    Download on the
                                </span>
                                <strong>App Store</strong>
                            </div>
                        </div>
                    </div>

                    <div className="footerSocialLinks">
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

            <div className="footerBottomSection">
                <div className="appContainer">
                    © Copyright Rimel 2022. All right reserved
                </div>
            </div>
        </footer>
    );
}

export default Footer;
