import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, train, searchData } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });
  const [loading, setLoading] = useState(false);

  if (!bookingData || !train) {
    return <div className="p-6 text-center">No booking data found</div>;
  }

  const calculateFare = () => {
    const farePerPassenger = train.classes[bookingData.class]?.fare || 0;
    return farePerPassenger * bookingData.passengers.length;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
      toast.error('Please fill all payment details');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating booking with data:', {
        trainId: train._id,
        travelDate: searchData.date,
        class: bookingData.class,
        passengers: bookingData.passengers
      });
      
      // Create booking after successful payment
      const response = await bookingAPI.create({
        trainId: train._id,
        travelDate: searchData.date,
        class: bookingData.class,
        passengers: bookingData.passengers
      });

      toast.success('Payment successful! Booking confirmed.');
      navigate('/booking-success', { state: { booking: response.data.booking } });
    } catch (error) {
      console.error('Payment/Booking error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-irctc-blue">Payment Details</h2>
          
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Train:</strong> {train.trainName} (#{train.trainNumber})</p>
                <p><strong>Route:</strong> {train.source} → {train.destination}</p>
                <p><strong>Date:</strong> {new Date(searchData.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p><strong>Class:</strong> {bookingData.class}</p>
                <p><strong>Passengers:</strong> {bookingData.passengers.length}</p>
                <p><strong>Total Fare:</strong> ₹{calculateFare()}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border rounded-lg"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                  maxLength="19"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Card Holder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 border rounded-lg"
                  value={paymentData.cardHolder}
                  onChange={(e) => setPaymentData({...paymentData, cardHolder: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 border rounded-lg"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                  maxLength="5"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 border rounded-lg"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  maxLength="3"
                  required
                />
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-irctc-blue text-white p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Amount to Pay:</span>
                <span className="text-2xl font-bold">₹{calculateFare()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing Payment...' : 'Pay Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;