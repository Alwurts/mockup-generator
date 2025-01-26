import { withPlausibleProxy } from "next-plausible";

const nextConfig = withPlausibleProxy({
	customDomain: "https://plausible.alwurts.com",
})({});

export default nextConfig;
