---
'@reown/appkit-react-native': patch
'@reown/appkit-bitcoin-react-native': patch
'@reown/appkit-coinbase-react-native': patch
'@reown/appkit-common-react-native': patch
'@reown/appkit-core-react-native': patch
'@reown/appkit-ethers-react-native': patch
'@reown/appkit-solana-react-native': patch
'@reown/appkit-ui-react-native': patch
'@reown/appkit-wagmi-react-native': patch
---

fix(core): attribute social & email logins to the app's project id

Social and email login opens the Reown Web Wallet in the system browser, and the
Web Wallet only knows its own project id — so every login started from an app was
attributed to it instead of to the app. Send the app's project id along as a
`projectId` query parameter on that URL, and encode the query parameter values.
Deep links to third-party wallets are unchanged.
