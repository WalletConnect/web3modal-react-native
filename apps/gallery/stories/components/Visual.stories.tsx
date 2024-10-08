import type { Meta, StoryObj } from '@storybook/react';

import { Visual } from '@reown/appkit-ui-react-native';
import { visualOptions } from '../../utils/PresetUtils';

const meta: Meta<typeof Visual> = {
  component: Visual,
  argTypes: {
    name: {
      control: {
        type: 'select'
      },
      options: visualOptions
    }
  },
  args: {
    name: 'browser'
  }
};

export default meta;
type Story = StoryObj<typeof Visual>;

export const Default: Story = {
  render: args => <Visual name={args.name} />
};
