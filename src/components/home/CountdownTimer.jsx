function CountdownTimer({
    items,
    className,
    itemClassName,
    valueFirst = false,
}) {
    return (
        <div className={className}>
            {items.map((item) => (
                <div className={itemClassName} key={item.label}>
                    {valueFirst ? (
                        <>
                            <strong>{item.value}</strong>
                            <span>{item.label}</span>
                        </>
                    ) : (
                        <>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CountdownTimer;
