import crypto from "crypto";
import fs from "fs";
function main(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const dirname = process.cwd()
    fs.writeFileSync(`${dirname}/private.key`, privateKey);
    fs.writeFileSync(`${dirname}/public.key`, publicKey);
}

main()