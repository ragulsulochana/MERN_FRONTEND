import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train, searchData } = location.state || {};

  const [bookingData, setBookingData] = useState({
    class: 'SL',
    passengers: [{ name: '', age: '', gender: 'Male' }]
  });
  const [loading, setLoading] = useState(false);

  if (!train) {
    return <div className="p-6 text-center">No train selected</div>;
  }

  const addPassenger = () => {
    setBookingData({
      ...bookingData,
      passengers: [...bookingData.passengers, { name: '', age: '', gender: 'Male' }]
    });
  };

  const removePassenger = (index) => {
    const newPassengers = bookingData.passengers.filter((_, i) => i !== index);
    setBookingData({ ...bookingData, passengers: newPassengers });
  };

  const updatePassenger = (index, field, value) => {
    const newPassengers = [...bookingData.passengers];
    newPassengers[index][field] = value;
    setBookingData({ ...bookingData, passengers: newPassengers });
  };

  const calculateFare = () => {
    const farePerPassenger = train.classes[bookingData.class]?.fare || 0;
    return farePerPassenger * bookingData.passengers.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passengers
    const isValid = bookingData.passengers.every(p => p.name && p.age && p.gender);
    if (!isValid) {
      toast.error('Please fill all passenger details');
      return;
    }

    // Navigate to payment page
    navigate('/payment', { 
      state: { 
        bookingData, 
        train, 
        searchData 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-irctc-blue">Book Ticket</h2>
          
          {/* Train Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold">{train.trainName} (#{train.trainNumber})</h3>
            <p>{train.source} → {train.destination}</p>
            <p>Date: {new Date(searchData.date).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Class</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={bookingData.class}
                onChange={(e) => setBookingData({...bookingData, class: e.target.value})}
              >
                {Object.entries(train.classes).map(([className, details]) => (
                  <option key={className} value={className}>
                    {className} - ₹{details.fare}
                  </option>
                ))}
              </select>
            </div>

            {/* Passengers */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Passenger Details</h3>
                <button
                  type="button"
                  onClick={addPassenger}
                  className="bg-irctc-blue text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Passenger
                </button>
              </div>

              {bookingData.passengers.map((passenger, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Passenger {index + 1}</h4>
                    {bookingData.passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="p-3 border rounded-lg"
                      value={passenger.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      className="p-3 border rounded-lg"
                      value={passenger.age}
                      onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                      required
                    />
                    <select
                      className="p-3 border rounded-lg"
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Fare Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Fare Summary</h3>
              <div className="flex justify-between">
                <span>Total Fare ({bookingData.passengers.length} passengers)</span>
                <span className="font-bold">₹{calculateFare()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-irctc-orange text-white p-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;