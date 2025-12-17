import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.source || !searchData.destination || !searchData.date) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await trainAPI.search(searchData);
      setTrains(response.data.trains);
      if (response.data.trains.length === 0) {
        toast.error('No trains found for this route');
      }
    } catch (error) {
      toast.error('Error searching trains');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (train) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate('/booking', { state: { train, searchData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Form */}
      <div className="bg-white shadow-md p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6 text-irctc-blue">
            Book Your Train Tickets
          </h1>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="text"
                placeholder="Source Station"
                className="w-full p-3 border rounded-lg"
                value={searchData.source}
                onChange={(e) => setSearchData({...searchData, source: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="text"
                placeholder="Destination Station"
                className="w-full p-3 border rounded-lg"
                value={searchData.destination}
                onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={searchData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-irctc-orange text-white p-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Trains'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Train Results */}
      <div className="max-w-6xl mx-auto p-6">
        {trains.map((train) => (
          <div key={train._id} className="bg-white rounded-lg shadow-md mb-4 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{train.trainName}</h3>
                <p className="text-gray-600">#{train.trainNumber}</p>
                <p className="text-sm text-gray-500">{train.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{train.source} → {train.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(train.availability || {}).map(([className, details]) => (
                <div key={className} className="border rounded p-3 text-center">
                  <div className="font-semibold">{className}</div>
                  <div className="text-sm text-gray-600">₹{details.fare}</div>
                  <div className="text-sm">
                    {details.availableSeats > 0 ? (
                      <span className="text-green-600">Available: {details.availableSeats}</span>
                    ) : (
                      <span className="text-red-600">Waiting List</span>
                    )}
                  </div>
                  {details.availableSeats > 0 && (
                    <button
                      onClick={() => handleBooking(train)}
                      className="mt-2 bg-irctc-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;