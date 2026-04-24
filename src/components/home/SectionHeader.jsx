import { Link } from "react-router-dom";
import arrowRightIcon from "../../assets/icons/icons arrow-right.svg";
import CountdownTimer from "./CountdownTimer";

function SectionHeader({
    title,
    timerItems,
    navigationLabel,
    actionLabel,
    actionTo,
    single = false,
}) {
    const classNames = ["home-section__header"];

    if (timerItems) {
        classNames.push("home-section__header--sales");
    }

    if (single) {
        classNames.push("home-section__header--single");
    }

    return (
        <div className={classNames.join(" ")}>
            {timerItems ? (
                <div className="home-section__title-group">
                    <h2>{title}</h2>
                    <CountdownTimer
                        className="home-section__timer"
                        itemClassName="home-section__timer-item"
                        items={timerItems}
                    />
                </div>
            ) : (
                <h2>{title}</h2>
            )}

            {actionLabel && actionTo ? (
                <Link
                    className="home-page__primary-link home-page__primary-link--compact"
                    to={actionTo}
                >
                    {actionLabel}
                </Link>
            ) : null}

            {!actionLabel && navigationLabel ? (
                <div className="home-section__nav-buttons">
                    <button aria-label={`Previous ${navigationLabel}`} type="button">
                        <img
                            alt=""
                            className="home-section__nav-icon home-section__nav-icon--left"
                            src={arrowRightIcon}
                        />
                    </button>
                    <button aria-label={`Next ${navigationLabel}`} type="button">
                        <img
                            alt=""
                            className="home-section__nav-icon"
                            src={arrowRightIcon}
                        />
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default SectionHeader;
