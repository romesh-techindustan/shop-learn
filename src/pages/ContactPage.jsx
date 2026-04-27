import { Link } from "react-router-dom";
import "./CommercePages.css";

export default function ContactPage() {
    return (
        <main className="ecommercePageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">Contact</span>
                </nav>

                <div className="contactPageLayout">
                    <aside className="contactSidebar">
                        <div className="contactInfoSection">
                            <div className="contactInfoHeader">
                                <div className="contactIconCircle">
                                    <span>📞</span>
                                </div>
                                <h3>Call To Us</h3>
                            </div>
                            <p>We are available 24/7, 7 days a week.</p>
                            <p>Phone: +8801611112222</p>
                        </div>
                        
                        <div className="contactDivider"></div>

                        <div className="contactInfoSection">
                            <div className="contactInfoHeader">
                                <div className="contactIconCircle">
                                    <span>✉️</span>
                                </div>
                                <h3>Write To US</h3>
                            </div>
                            <p>Fill out our form and we will contact you within 24 hours.</p>
                            <p>Emails: customer@exclusive.com</p>
                            <p>Emails: support@exclusive.com</p>
                        </div>
                    </aside>

                    <section className="contactFormSection">
                        <form className="contactForm">
                            <div className="contactFormRow">
                                <input type="text" placeholder="Your Name *" required className="commerce-input" />
                                <input type="email" placeholder="Your Email *" required className="commerce-input" />
                                <input type="tel" placeholder="Your Phone *" required className="commerce-input" />
                            </div>
                            <textarea placeholder="Your Message" className="commerce-input contactTextArea"></textarea>
                            <div className="contactFormFooter">
                                <button type="submit" className="commerce-button commerce-button--primary">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
