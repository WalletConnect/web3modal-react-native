# Development

## Workspace setup

Install dependencies from the repository's root directory (this will also set up the example project workspace):

```bash
yarn
```

To create your ProjectID, head to [dashboard.reown.com](https://dashboard.reown.com/). Then copy `apps/native/.env.example` to `apps/native/.env` and set `EXPO_PUBLIC_PROJECT_ID` to your ProjectID — the example app reads it from there.

## Commands

Execute all commands from the root.

- `yarn ios` - Run the example project in an iOS simulator.
- `yarn android` - Run the example project in an Android simulator.
- `yarn lint` - Run the linter.
- `yarn test` - Run jest tests.
- `yarn pre-publish` - Run all checks and build
