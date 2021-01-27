import { defineComponent } from '@vue/composition-api'
import { field, minLength, required } from '../../../src'

const template = `
  <form  @submit.prevent="inputField.validate()" data-test="form">
    <input
      v-model="inputField.value"
      @blur="inputField.validate()"
      type="text"
      data-test="input"
    />
    <span v-if="inputField.invalid" data-test="error-messages">
      {{ inputField.errorMessages }}
    </span>
  </form>
`

export default defineComponent({
  name: 'CompositionUsingFieldValue',
  template,
  setup() {
    const inputField = field([required(), minLength(5)])
    return {
      inputField
    }
  }
})
