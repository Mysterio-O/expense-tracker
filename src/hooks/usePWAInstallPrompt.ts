import { useEffect, useState, useRef, useCallback } from 'react';

// Chrome's event type
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstallPrompt() {
    const [canInstall, setCanInstall] = useState(false);
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            console.log('[PWA] beforeinstallprompt fired');
            const event = e as BeforeInstallPromptEvent;

            // Stop the default mini-infobar
            event.preventDefault();

            deferredPromptRef.current = event;
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        const deferredPrompt = deferredPromptRef.current;
        if (!deferredPrompt) {
            console.log('[PWA] No deferred prompt available');
            return;
        }

        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', choiceResult.outcome);

        // Event can only be used once
        deferredPromptRef.current = null;
        setCanInstall(false);
    }, []);

    return { canInstall, promptInstall };
}
