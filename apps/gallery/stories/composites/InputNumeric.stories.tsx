/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { InputNumeric } from '@web3modal/ui-react-native';

const meta: Meta<typeof InputNumeric> = {
  component: InputNumeric,
  args: {
    disabled: false
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: "Disable input (doesn't work on web)"
    }
  }
};

export default meta;
type Story = StoryObj<typeof InputNumeric>;

export const Default: Story = {
  render: args => <InputNumeric disabled={args.disabled} style={{ outlineStyle: 'none' }} />
};
