const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export function isValidEmailOrPhone(value) {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
        return false;
    }

    if (normalizedValue.includes("@")) {
        return emailPattern.test(normalizedValue);
    }

    const digitsOnly = normalizedValue.replace(/\D/g, "");

    return (
        phonePattern.test(normalizedValue) &&
        digitsOnly.length >= 7 &&
        digitsOnly.length <= 15
    );
}

export function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}
