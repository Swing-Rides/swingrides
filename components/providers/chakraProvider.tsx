"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"

const system = createSystem(defaultConfig, {
        cssVarsPrefix: "ck",
        preflight: false,
})

// useSyncExternalStore is React's recommended way to detect client-side rendering.
// subscribe is a no-op (no external store to subscribe to).
// getSnapshot returns true on the client, getServerSnapshot returns false on the server.
// This avoids setState inside useEffect entirely.
function useIsClient(): boolean {
        return useSyncExternalStore(
                () => () => { },     // subscribe: no-op cleanup
                () => true,         // getSnapshot: client always returns true
                () => false,        // getServerSnapshot: server always returns false
        )
}

export function ChakraUIProvider({ children }: { children: ReactNode }) {
        const isClient = useIsClient()

        if (!isClient) {
                return <>{children}</>
        }

        return (
                <ChakraProvider value={system}>
                        {children}
                </ChakraProvider>
        )
}
