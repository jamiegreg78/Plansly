import { mount } from '@vue/test-utils'
import TextInput from '../../src/components/inputs/TextInput.vue'
import { describe, it, expect } from 'vitest'


describe('TextInput.vue', async () => {
	it('Props should be rendered properly', () => {
		expect(TextInput).toBeTruthy()

		const label = 'Test Label'
		const value = 'Sample Value'

		const wrapper = mount(TextInput, {
			props: { label: label, type: 'email', modelValue: value}
		})
		
		expect(wrapper.find('label').text()).toBe(label) // Label is rendered correctly
		expect(wrapper.find('input').element.value).toBe(value) // Value is inserted into the text input correctly
	})

	it('Component should handle the props changing ', async () => {
		expect(TextInput).toBeTruthy() // Component should exist

		const testValue = 'testValue'
		const alternateTestValue = 'notTestValue'
		const value = 'testValue'
		const alternateValue = 'notTestValue'
		const label = 'Test Input'
		const testProps = { label: label, type:'email', modelValue: value, hasError: false, required: true}
		
		const wrapper = mount(TextInput, {
			props: testProps
		})
		
		expect(wrapper.vm.props.modelValue).toBe(testValue) // Should be equal to the initial test value
		expect(wrapper.vm.props.modelValue).not.toBe(alternateTestValue) // should not be equal to the alternate value
		
		
		await wrapper.setProps({...testProps, modelValue: alternateValue}) // swap the props, so the alternateValue is now active

		expect(wrapper.vm.props.modelValue).toBe(alternateTestValue) // The swapped value is now in use
		expect(wrapper.vm.props.modelValue).not.toBe(testValue) // The removed value is no longer in use
	})
})

