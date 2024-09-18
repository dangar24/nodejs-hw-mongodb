const parseInteger = (value, defaultValue) => {

    if (typeof value !== 'string') {
        return defaultValue;
    };
    const parsedValue = parseInt(value);
    if (Number.isNaN(parsedValue)) {
        return defaultValue;
    } else {
        return parsedValue;
    };
};

const parsePaginationParams = ({ page, perPage }) => {

    const ParsedPerPage = parseInteger(perPage, 10);
    const ParsedPage = parseInteger(page, 1);

    return {
        perPage: ParsedPerPage,
        page: ParsedPage
    };
};

export default parsePaginationParams;