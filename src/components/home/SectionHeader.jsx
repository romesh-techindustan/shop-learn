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
    const classNames = ["homeSectionHeader"];

    if (timerItems) {
        classNames.push("homeSectionHeaderSales");
    }

    if (single) {
        classNames.push("homeSectionHeaderSingle");
    }

    return (
        <div className={classNames.join(" ")}>
            {timerItems ? (
                <div className="homeSectionTitleGroup">
                    <h2>{title}</h2>
                    <CountdownTimer
                        className="homeSectionTimer"
                        itemClassName="homeSectionTimerItem"
                        items={timerItems}
                    />
                </div>
            ) : (
                <h2>{title}</h2>
            )}

            {actionLabel && actionTo ? (
                <Link
                    className="homePrimaryLink homePrimaryLinkCompact"
                    to={actionTo}
                >
                    {actionLabel}
                </Link>
            ) : null}

            {!actionLabel && navigationLabel ? (
                <div className="homeSectionNavButtons">
                    <button aria-label={`Previous ${navigationLabel}`} type="button">
                        <img
                            alt=""
                            className="homeSectionNavIcon homeSectionNavIconLeft"
                            src={arrowRightIcon}
                        />
                    </button>
                    <button aria-label={`Next ${navigationLabel}`} type="button">
                        <img
                            alt=""
                            className="homeSectionNavIcon"
                            src={arrowRightIcon}
                        />
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default SectionHeader;
