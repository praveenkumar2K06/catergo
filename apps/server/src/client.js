import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./config/env.js";

mongoose.set("strictQuery", true);
dns.setDefaultResultOrder("ipv4first");

const isSrvDnsError = (error) =>
    error?.syscall === "querySrv" && ["ECONNREFUSED", "EAI_AGAIN", "ETIMEOUT"].includes(error?.code);

const withSrvDnsFallback = async (connectFn) => {
    try {
        return await connectFn();
    } catch (error) {
        const isSrvUrl = env.DATABASE_URL.startsWith("mongodb+srv://");

        if (!isSrvUrl || !isSrvDnsError(error)) {
            throw error;
        }

        const currentServers = dns.getServers();
        const fallbackServers = ["8.8.8.8", "1.1.1.1"];

        dns.setServers([...fallbackServers, ...currentServers.filter((server) => !fallbackServers.includes(server))]);

        console.warn(
            "MongoDB SRV DNS lookup failed with local resolver. Retrying with fallback DNS servers...",
        );

        return connectFn();
    }
};

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    await withSrvDnsFallback(() =>
        mongoose.connect(env.DATABASE_URL),
    );
}

export default mongoose;
