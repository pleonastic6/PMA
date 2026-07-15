function calculateAge(birthDate) {
    if (!birthDate) {
        return null;
    }

    const parsed = new Date(birthDate);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    const monthDifference = today.getMonth() - parsed.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < parsed.getDate())
    ) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}

module.exports = {
    calculateAge,
};
