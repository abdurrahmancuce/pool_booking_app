const parseBookingDate = (dateValue) => {
    if (typeof dateValue !== 'string') return null;

    const [day, month, year] = dateValue.split('.').map(Number);
    if (!day || !month || !year) return null;

    const parsedDate = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (
        parsedDate.getFullYear() !== year
        || parsedDate.getMonth() !== month - 1
        || parsedDate.getDate() !== day
    ) return null;

    return parsedDate;
};

export const getBookingPeriod = (bookingList) => {
    const dates = (Array.isArray(bookingList) ? bookingList : [])
        .map(({ date }) => parseBookingDate(date))
        .filter(Boolean)
        .sort((first, second) => first.getTime() - second.getTime());

    if (!dates.length) return null;

    const endDate = dates[dates.length - 1];
    const nextDrawDate = new Date(endDate);
    nextDrawDate.setDate(nextDrawDate.getDate() + 1);

    return { startDate: dates[0], endDate, nextDrawDate };
};

export const isBookingPeriodActive = (bookingList, referenceDate = new Date()) => {
    const period = getBookingPeriod(bookingList);
    if (!period) return false;

    const referenceDay = new Date(referenceDate);
    referenceDay.setHours(0, 0, 0, 0);

    const nextDrawDay = new Date(period.nextDrawDate);
    nextDrawDay.setHours(0, 0, 0, 0);

    return referenceDay < nextDrawDay;
};

export const formatBookingPeriodDate = (date) => date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});
