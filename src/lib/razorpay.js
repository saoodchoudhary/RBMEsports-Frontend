export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout
 * @param {object} options Razorpay options object
 */
export function openRazorpay(options) {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }
  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
}