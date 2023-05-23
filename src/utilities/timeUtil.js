const convertToStandardDateTime = (militaryTime) => {
    const localDate = new Date(militaryTime);
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
	return localDate.toLocaleString([], options);
}

const convertToStandardTime = (militaryTime) => {
    const [date, time] = militaryTime.split(' ');
    const [hours, minutes] = time.split(':');
    const standardHours = hours % 12 || 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedTime = `${standardHours}:${minutes} ${period}`;
    return formattedTime;
}

module.exports = {
    convertToStandardDateTime,
    convertToStandardTime,
};