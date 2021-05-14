export const toFixLength = ({ text, length }) => (text.length <= length ? text : `${text.substring(0, length - 3)}...`);
