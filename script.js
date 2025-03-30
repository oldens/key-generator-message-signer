async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["sign", "verify"]
    );

    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    document.getElementById("public-key").value = arrayBufferToBase64(publicKey);
    document.getElementById("private-key").value = arrayBufferToBase64(privateKey);
}

async function signMessage() {
    const privateKeyBase64 = document.getElementById("private-key-sign").value;
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        base64ToArrayBuffer(privateKeyBase64),
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256"
        },
        false,
        ["sign"]
    );

    const message = new TextEncoder().encode(document.getElementById("message").value);
    const signature = await window.crypto.subtle.sign(
        {
            name: "RSASSA-PKCS1-v1_5"
        },
        privateKey,
        message
    );

    document.getElementById("signature").value = arrayBufferToBase64(signature);
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

document.getElementById("generate-keys").addEventListener("click", generateKeyPair);
document.getElementById("sign-message").addEventListener("click", signMessage);
