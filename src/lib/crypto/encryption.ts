
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'sunat-ai-secure-encryption-key-32';

export async function encryptData(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const keyBuffer = encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decryptData(encryptedBase64: string): Promise<string> {
    const encoder = new TextEncoder();
    const combined = new Uint8Array(
        atob(encryptedBase64).split("").map((c) => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const keyBuffer = encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        data
    );

    return new TextDecoder().decode(decrypted);
}
