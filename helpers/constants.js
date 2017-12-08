import {colors} from '../Styles.js' 

let statusText = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ','ΕΤΟΙΜΑΖΕΤΑΙ', 'ΕΤΟΙΜΑΣΤΗΚΕ', 'ΣΤΟΝ ΔΡΟΜΟ'];
statusText[10] = 'ΟΛΟΚΛΗΡΩΘΗΚΕ';
statusText[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';

let highlightColors = [colors.main, colors.light, colors.lightgreen, colors.green];
highlightColors[10] = colors.green;
highlightColors[99] = colors.black;

const gainMultiplier = 0.15;
const extraCharge = 0.50;

export default {
	highlightColors,
	statusText,
	gainMultiplier,
	extraCharge
}