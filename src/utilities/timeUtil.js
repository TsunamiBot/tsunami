const convertToStandardDateTime = (militaryTime) => {
    const localDate = new Date(militaryTime);
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
	return localDate.toLocaleString([], options);
}

module.exports = {
    convertToStandardDateTime,
};