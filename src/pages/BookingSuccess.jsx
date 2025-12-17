import { useLocation, Link } from 'react-router-dom';

const BookingSuccess = () => {
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    return <div className="p-6 text-center">No booking information found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="font-bold text-lg mb-4">Booking Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">PNR:</span>
                <span className="font-bold text-irctc-blue">{booking.PNR}</span>
              </div>
              <div className="flex justify-between">
                <span>Train:</span>
                <span>{booking.trainName} (#{booking.trainNumber})</span>
              </div>
              <div className="flex justify-between">
                <span>Route:</span>
                <span>{booking.source} → {booking.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Class:</span>
                <span>{booking.class}</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span>{booking.passengers.length}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Fare:</span>
                <span>₹{booking.totalFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-medium">{booking.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              Your ticket has been booked successfully. Please save your PNR number for future reference.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link
                to="/bookings"
                className="bg-irctc-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                View All Bookings
              </Link>
              <Link
                to="/"
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Book Another Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;