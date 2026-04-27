import { Link } from "react-router-dom";
import storyImage from "../assets/about_story.png";
import team1 from "../assets/team_member_1.png";
import team2 from "../assets/team_member_2.png";
import team3 from "../assets/team_member_3.png";
import "./CommercePages.css";

function StatCard({ icon, value, label, highlight }) {
    return (
        <div className={`aboutStatCard ${highlight ? "aboutStatCard--highlight" : ""}`}>
            <div className="aboutStatIconWrapper">
                <div className="aboutStatIconInner">
                    <img src={icon} alt="" />
                </div>
            </div>
            <div className="aboutStatContent">
                <h3>{value}</h3>
                <p>{label}</p>
            </div>
        </div>
    );
}

function TeamMemberCard({ image, name, role }) {
    return (
        <div className="teamMemberCard">
            <div className="teamMemberImageWrapper">
                <img src={image} alt={name} />
            </div>
            <div className="teamMemberInfo">
                <h3>{name}</h3>
                <p>{role}</p>
                <div className="teamMemberSocials">
                    {/* Placeholder social icons */}
                    <span>𝕏</span>
                    <span>📸</span>
                    <span>in</span>
                </div>
            </div>
        </div>
    );
}

function ServiceFeature({ icon, title, description }) {
    return (
        <div className="serviceFeatureItem">
            <div className="serviceFeatureIconWrapper">
                <div className="serviceFeatureIconInner">
                    <img src={icon} alt="" />
                </div>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default function AboutPage() {
    return (
        <main className="ecommercePageWrapper">
            <div className="appContainer">
                <nav className="breadcrumbNav" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumbSeparator">/</span>
                    <span className="breadcrumbCurrentPage">About</span>
                </nav>

                <section className="aboutStorySection">
                    <div className="aboutStoryContent">
                        <h1>Our Story</h1>
                        <p>
                            Launched in 2015, Exclusive is South Asia's premier online shopping 
                            marketplace with an active presence in Bangladesh. Supported by 
                            wide range of tailored marketing, data and service solutions, 
                            Exclusive has 10,500 sellers and 300 brands and serves 3 
                            millions customers across the region.
                        </p>
                        <p>
                            Exclusive has more than 1 Million products to offer, growing at a 
                            very fast. Exclusive offers a diverse assortment in categories 
                            ranging from consumer.
                        </p>
                    </div>
                    <div className="aboutStoryImage">
                        <img src={storyImage} alt="Our Story" />
                    </div>
                </section>

                <section className="aboutStatsGrid">
                    <StatCard 
                        icon="/src/assets/icons/icon_shop.svg" 
                        value="10.5k" 
                        label="Sellers active our site" 
                    />
                    <StatCard 
                        icon="/src/assets/icons/Icon-Sale.svg" 
                        value="33k" 
                        label="Monthly Product Sale" 
                        highlight={true}
                    />
                    <StatCard 
                        icon="/src/assets/icons/Icon-Shopping-Bag.svg" 
                        value="45.5k" 
                        label="Customer active in our site" 
                    />
                    <StatCard 
                        icon="/src/assets/icons/Icon-Moneybag.svg" 
                        value="25k" 
                        label="Anual gross sale in our site" 
                    />
                </section>

                <section className="aboutTeamSection">
                    <div className="aboutTeamGrid">
                        <TeamMemberCard 
                            image={team1} 
                            name="Tom Cruise" 
                            role="Founder & Chairman" 
                        />
                        <TeamMemberCard 
                            image={team2} 
                            name="Emma Watson" 
                            role="Managing Director" 
                        />
                        <TeamMemberCard 
                            image={team3} 
                            name="Will Smith" 
                            role="Product Designer" 
                        />
                    </div>
                    <div className="aboutTeamPagination">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </section>

                <section className="aboutServicesSection">
                    <ServiceFeature 
                        icon="/src/assets/icons/icon-delivery.svg" 
                        title="FREE AND FAST DELIVERY" 
                        description="Free delivery for all orders over $140" 
                    />
                    <ServiceFeature 
                        icon="/src/assets/icons/Icon-Customer-Service.svg" 
                        title="24/7 CUSTOMER SERVICE" 
                        description="Friendly 24/7 customer support" 
                    />
                    <ServiceFeature 
                        icon="/src/assets/icons/Icon-secure.svg" 
                        title="MONEY BACK GUARANTEE" 
                        description="We return money within 30 days" 
                    />
                </section>
            </div>
        </main>
    );
}
