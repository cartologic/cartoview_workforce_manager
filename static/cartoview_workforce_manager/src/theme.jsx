import {
	cyan500,
	cyan700,
	pinkA200,
	grey100,
	grey300,
	grey400,
	grey500,
	white,
	darkBlack,
	fullBlack,
	blue500,
	blue700,
	fullWhite
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import zIndex from 'material-ui/styles/zIndex';
import spacing from 'material-ui/styles/spacing';

export default {
	spacing: spacing,
	zIndex: zIndex,
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: blue500,
		primary2Color: blue700,
		primary3Color: grey400,
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: darkBlack,
		alternateTextColor: white,
		canvasColor: fullWhite,
		borderColor: grey300,
		disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: blue700,
		clockCircleColor: fade(darkBlack, 0.07),
		shadowColor: fullBlack,
	},
};
