// Використовуємо elliptic та CryptoJS для роботи з цифровим підписом
// Генерація пари ключів (публічного та приватного) у форматі hex
function generateKeyPair() {
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.genKeyPair();
    const privateKeyHex = keyPair.getPrivate('hex');
    const publicKeyHex = keyPair.getPublic('hex');

    document.getElementById("private-key").value = privateKeyHex;
    document.getElementById("public-key").value = publicKeyHex;
    // Якщо потрібно використовувати приватний ключ для підпису,
    // заповнюємо відповідне поле
    document.getElementById("private-key-sign").value = privateKeyHex;
    // Так само, заповнюємо поле для публічного ключа при валідації підпису
    document.getElementById("public-key-validate").value = publicKeyHex;
}

// Підпис повідомлення з використанням приватного ключа
function signMessage() {
    const privateKeyHex = document.getElementById("private-key-sign").value;
    if (!privateKeyHex) {
        alert("Вкажіть приватний ключ для підпису");
        return;
    }
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');
    const message = document.getElementById("message").value;
    // Хешування повідомлення з використанням SHA-256 через CryptoJS
    const msgHash = CryptoJS.SHA256(message).toString();
    const signatureObj = keyPair.sign(msgHash, { canonical: true });
    const signatureHex = signatureObj.toDER('hex');
    document.getElementById("signature").value = signatureHex;
}

// Перевірка підпису за допомогою публічного ключа
function verifyMessage() {
    const publicKeyHex = document.getElementById("public-key-validate").value;
    if (!publicKeyHex) {
        alert("Вкажіть публічний ключ для верифікації підпису");
        return;
    }
    const ec = new elliptic.ec('secp256k1');
    const key = ec.keyFromPublic(publicKeyHex, 'hex');
    const message = document.getElementById("message-validate").value;
    const msgHash = CryptoJS.SHA256(message).toString();
    const signatureHex = document.getElementById("signature-validate").value;
    let isValid = false;
    try {
        isValid = key.verify(msgHash, signatureHex);
    } catch (error) {
        console.error("Помилка верифікації:", error);
    }
    document.getElementById("validation-result").value = isValid ? "Підпис дійсний" : "Підпис недійсний";
}

// Прив’язка функцій до кнопок
document.getElementById("generate-keys").addEventListener("click", generateKeyPair);
document.getElementById("sign-message").addEventListener("click", signMessage);
document.getElementById("verify-message").addEventListener("click", verifyMessage);
