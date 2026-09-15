import localFont from "next/font/local";

export const beVietnamPro = localFont({
  src: [
    {
      path: "../assets/fonts/be-vietnam-pro/BeVietnamPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/be-vietnam-pro/BeVietnamPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/be-vietnam-pro/BeVietnamPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/be-vietnam-pro/BeVietnamPro-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/be-vietnam-pro/BeVietnamPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
