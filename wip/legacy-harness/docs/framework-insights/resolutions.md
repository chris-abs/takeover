# Known resolutions

Recurring framework issues that already have a settled answer. When an app hits one, report it as resolved and cite the entry here. Do not raise it as an open question.

## Auth and HTTP clients in tests without MSAL

**Issue:** components need `AuthContext` from `vp-authframework` and configured clients from `vp-httpclientframework`, and the real providers need an MSAL sign-in that tests cannot do.

**Resolution:** a shared `renderWithProviders` helper in `src/__scripts__/test-utils/` composes only the providers a test asks for:

- **Auth:** `AuthContext.Provider` with a fixed test value: `isAuthenticated: true`, a test `account`, resolved `logIn`/`logOut`/`refreshLogin`/`acquireTokenSilently`, and `checkAuthorisation` returning `true`. Tests override fields as needed.
- **HTTP clients:** `HttpClientsContext.Provider` with `isConfigured: true` and one plain `axios.create({ baseURL })` per client name, keyed to the app's client base URLs. Each client is registered with `AxiosInstanceManager.setInstance`, so code that reads the manager gets the same instance. MSW intercepts them at the transport.
- **Business id:** the real `BusinessIdProvider`, given `AxiosInstanceManager.getAllClients()`.
- **Cleanup:** a request interceptor attaches an `AbortController` signal to every request, and test cleanup aborts it and ejects the interceptor, so no request outlives its test.

No MSAL, no mocked hooks, no mocked client packages.
