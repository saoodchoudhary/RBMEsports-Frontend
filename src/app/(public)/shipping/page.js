import LegalPage from "@/components/legal/LegalPage";
import { FiHome, FiCheckCircle, FiMail, FiInfo } from "react-icons/fi";
import { GiDeliveryDrone, GiDigitalTrace } from "react-icons/gi";
import { MdOutlineDeliveryDining } from "react-icons/md";

export const metadata = {
  title: "Shipping & Delivery Policy | RBM ESports",
  description: "Digital service delivery policy."
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping & Delivery Policy"
      subtitle="Digital services only — no physical shipping."
      lastUpdated="2026-02-10"
    >
      <div className="space-y-6">

        {/* No Physical Goods - Highlighted */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
            <GiDigitalTrace className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Physical Goods</h2>
          <p className="text-gray-700 max-w-lg mx-auto">
            RBM ESports provides <strong className="text-gray-900">100% digital tournament services</strong> only. 
            No physical products are shipped or delivered.
          </p>
        </div>

        {/* Service Delivery */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GiDeliveryDrone className="w-5 h-5 text-blue-600" />
            Service Delivery
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">Registration Confirmation</p>
                <p className="text-xs text-gray-600">Instant confirmation via dashboard & email</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FiHome className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">Room Details</p>
                <p className="text-xs text-gray-600">Shared before match via dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Delivery Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Instant Digital Access</h3>
              <p className="text-sm text-gray-700">
                All tournament services are delivered digitally through your RBM ESports dashboard. 
                No shipping address required. Access is granted immediately upon successful registration.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-bold text-gray-900 mb-2">Support</h2>
          <p className="text-sm text-gray-700">
            For delivery-related queries:{' '}
            <a href="mailto:rbmesports04@gmail.com" className="text-blue-600 font-semibold hover:underline">
              rbmesports04@gmail.com
            </a>
          </p>
        </div>
      </div>
    </LegalPage>
  );
}