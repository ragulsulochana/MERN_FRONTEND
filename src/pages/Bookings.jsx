import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to view bookings');
      navigate('/login');
      return;
    }
    
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Error fetching bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (pnr) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.cancel(pnr);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error('Error cancelling booking');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-irctc-blue">My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{booking.trainName}</h3>
                    <p className="text-gray-600">#{booking.trainNumber}</p>
                    <p className="text-sm font-medium text-irctc-blue">PNR: {booking.PNR}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium">{booking.source} → {booking.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Travel Date</p>
                    <p className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="font-medium">{booking.class}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Passengers: {booking.passengers.length}</p>
                      <p className="font-bold">Total Fare: ₹{booking.totalFare}</p>
                    </div>
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.PNR)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                {/* Passenger Details */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Passengers:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="text-sm">
                        {passenger.name} ({passenger.age}yrs, {passenger.gender})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;