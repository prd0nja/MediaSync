import { TelegramClient, sessions } from "telegram";
import { createInterface } from "readline/promises";

const { StringSession } = sessions;
const rl = createInterface({ input: process.stdin, output: process.stdout });
const apiId = parseInt(await rl.question("API ID: "));
const apiHash = await rl.question("API Hash: ");

const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
	connectionRetries: 5
});

await client.start({
	phoneNumber: () => rl.question("Phone number: "),
	password: () => rl.question("2FA password (blank if none): "),
	phoneCode: () => rl.question("Login code: "),
	onError: err => console.error(err)
});

console.log("\nAdd to .env TELEGRAM_STRING_SESSION:");
console.log(client.session.save());

await client.disconnect();
rl.close();
