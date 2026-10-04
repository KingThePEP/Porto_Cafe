import { purgeTestRows } from "./test-data";

// Dijalankan satu kali setelah seluruh worker selesai, jadi tidak ada balapan
// dengan worker yang masih menulis data test.
export default async function globalTeardown(): Promise<void> {
  await purgeTestRows();
}
