// This file contains the types for the color picker
export interface ColorPickerOptions {
	name?: string
	hexValue?: string
}

// This array contains the colors that can be selected in the color picker
// Updating this array will update the colors that can be selected in the color picker across the entire application
// Removing colours will not remove them from existing boards, but they will not be selectable for new boards
export const ColorArray: Array<ColorPickerOptions> = [
	{
		name: 'red',
		hexValue: '#FF4848'
	},
	{
		name: 'green',
		hexValue: '#3ccf63'
	},
	{
		name: 'blue',
		hexValue: '#3cb4cf'
	},
	{
		name: 'yellow',
		hexValue: '#ffdd00'
	},
	{
		name: 'purple',
		hexValue: '#f55cff'
	}
]
