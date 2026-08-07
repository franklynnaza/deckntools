export default function SecurePayments({ className }: { className?: string }) {
  return (
    <div className={className ?? "mt-10"}>
      <h3 className="text-3xl font-bold mb-6">100% Secure Payments</h3>
      <div className="flex flex-wrap items-center gap-6">
        

        {/* PayPal */}
        <svg className="h-8" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="700" fill="#003087">PayPal</text>
        </svg>

        {/* Klarna */}
        {/* <div className="bg-[#FFB3C7] px-3 py-1 rounded">
          <span className="text-black font-bold text-lg">Klarna</span>
        </div> */}

        {/* Google Pay */}
        {/* <svg className="h-8" viewBox="0 0 65 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#4285F4"/>
          <circle cx="12" cy="12" r="10" fill="#EA4335" fillOpacity="0.3"/>
          <circle cx="12" cy="12" r="10" fill="#FBBC05" fillOpacity="0.2"/>
          <circle cx="12" cy="12" r="10" fill="#34A853" fillOpacity="0.2"/>
          <text x="26" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="500" fill="#5F6368">G Pay</text>
        </svg> */}

        {/* Apple Pay */}
        <svg className="h-8" viewBox="0 0 65 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7C11.2 7.8 10 8.3 9 8.3C8.9 7.3 9.3 6.2 10 5.5C10.8 4.7 12 4.2 12.9 4.2C13 5.2 12.7 6.2 12 7ZM12.9 8.5C11.5 8.4 10.3 9.3 9.6 9.3C8.9 9.3 7.8 8.5 6.7 8.5C5.2 8.5 3.8 9.4 3.1 10.8C1.6 13.5 2.7 17.5 4.1 19.7C4.8 20.8 5.7 22 6.8 22C7.9 22 8.3 21.3 9.6 21.3C10.9 21.3 11.2 22 12.4 22C13.6 22 14.4 20.9 15.1 19.8C15.9 18.5 16.2 17.3 16.2 17.2C16.2 17.2 13.9 16.3 13.9 13.7C13.9 11.5 15.7 10.5 15.8 10.4C14.8 8.9 13.2 8.7 12.9 8.5Z" fill="black"/>
          <text x="20" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="500" fill="black">Pay</text>
        </svg>

        {/* AMEX */}
        <svg className="h-8" viewBox="0 0 50 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="25" rx="3" fill="#006FCF"/>
          <text x="5" y="17" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="white">AMEX</text>
        </svg>

        {/* VISA */}
        <svg className="h-8" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="18" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="#1A1F71">VISA</text>
        </svg>

        {/* Mastercard */}
        <svg className="h-8" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="12.5" r="9" fill="#EB001B"/>
          <circle cx="22" cy="12.5" r="9" fill="#FF5F00"/>
          <circle cx="31" cy="12.5" r="9" fill="#F79E1B"/>
        </svg>
          {/* Stripe */}
        <svg className="h-8" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="25" rx="4" fill="#635BFF"/>
          <text x="8" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="600" fill="white">stripe</text>
        </svg>
      </div>
    </div>
  )
}