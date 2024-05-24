import crypto from "crypto";
import fs from "fs";
function main(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    const dirname = process.cwd()
    fs.writeFileSync(`${dirname}/App/private.key`, privateKey);
    fs.writeFileSync(`${dirname}/App/public.key`, publicKey);
}

main()