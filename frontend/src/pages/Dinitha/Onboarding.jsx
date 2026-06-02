import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Lottie from 'lottie-react'; 
import calenderAnimation from '../../assets/Dinitha/date.json';
import tripAnimation from '../../assets/Dinitha/trip.json';
import axios from 'axios';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [tripPreference, setTripPreference] = useState('');
  const [days, setDays] = useState('');
  const navigate = useNavigate();
  const url=import.meta.env.BACKEND_URL;

  const handleNext = async () => {
    if (step === 1 && !tripPreference) {
      toast.error('Please select a trip preference!');
      return;
    }
    if (step === 2 && !days) {
      toast.error('Please select the number of days!');
      return;
    }
    if (step === 3) {
      
      const userData = {
        tripPreference,
        days,
      };

      try {
        await axios.post(url+'/api/user/preferences', userData, {
            withCredentials: true,
        });
        toast.success('Preferences saved successfully!');
        navigate('/');
    } catch (error) {
        toast.error('Failed to save preferences. Please try again.');
        console.error('Failed to save preferences:', error.response?.data || error);
    }
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
      <div className="flex justify-end mb-4">
        <button 
            onClick={handleSkip} 
            className="bg-gray-200 text-black w-28 rounded-xl text-center hover:bg-gray-300 transition duration-300"
        >
          I’ll do it later
        </button>
      </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Onboarding</h2>
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-6 text-center">Where is the most suitable category for you?</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <img 
                  src="https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2Fcff61a7f-8683-41ed-b19a-5539a8914edd.jpg?crop=2560%2C1706%2C0%2C0" 
                  alt="Adventure Tours" 
                  className={`w-full h-60 object-cover rounded-lg ${tripPreference === 'Adventure Tours' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setTripPreference('Adventure Tours')}
                />
                {tripPreference === 'Adventure Tours' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <span className="text-white text-xl">Adventure Tours</span>
                  </div>
                )}
                <p className="mt-2 text-center">Adventure Tours</p>
              </div>
              <div className="relative">
                <img 
                  src="https://www.lovesrilanka.org/wp-content/uploads/2020/06/LSL_B2_Sinharaja-Rainforest_800x520.jpg" 
                  alt="Wildlife and Nature Tours" 
                  className={`w-full h-60 object-cover rounded-lg ${tripPreference === 'Wildlife and Nature Tours' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setTripPreference('Wildlife and Nature Tours')}
                />
                {tripPreference === 'Wildlife and Nature Tours' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <span className="text-white text-xl">Wild Life and Nature Tours</span>
                  </div>
                )}
                <p className="mt-2 text-center">Wild Life and Nature Tours</p>
              </div>
              <div className="relative">
                <img 
                  src="https://cdn.i.haymarketmedia.asia/?n=campaign-asia%2Fcontent%2Fshutterstock_691606891.jpg&h=570&w=855&q=100&v=20170226&c=1" 
                  alt="Cultural Tours" 
                  className={`w-full h-60 object-cover rounded-lg ${tripPreference === 'Cultural Tours' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setTripPreference('Cultural Tours')}
                />
                {tripPreference === 'Cultural Tours' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <span className="text-white text-xl">Cultural Tours</span>
                  </div>
                )}
                <p className="mt-2 text-center">Cultural Tours</p>
              </div>
              <div className="relative">
                <img 
                  src="https://www.introtravel.com/media/images/DRG_0971-min.width-800.jpg" 
                  alt="Iconic Tours" 
                  className={`w-full h-60 object-cover rounded-lg ${tripPreference === 'Iconic Tours' ? 'border-2 border-blue-600' : ''}`}
                  onClick={() => setTripPreference('Iconic Tours')}
                />
                {tripPreference === 'Iconic Tours' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <span className="text-white text-xl">Iconic Tours</span>
                  </div>
                )}
                <p className="mt-2 text-center">Iconic Tours</p>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-6 text-center">How many days do you want to trip?</h3>
            <div className="flex justify-center mb-4 h-72">
            <Lottie animationData={calenderAnimation} loop={true}/>
            </div>

            <div className="flex flex-col items-center">
              <label className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="days" 
                  value="1-3" 
                  checked={days === '1-3'}
                  onChange={(e) => setDays(e.target.value)}
                  className="mr-2"
                />
                1-3 days
              </label>
              <label className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="days" 
                  value="4-7" 
                  checked={days === '4-7'}
                  onChange={(e) => setDays(e.target.value)}
                  className="mr-2"
                />
                4-7 days
              </label>
              <label className="flex items-center mb-2">
                <input 
                  type="radio" 
                  name="days" 
                  value="8+" 
                  checked={days === '8+'}
                  onChange={(e) => setDays(e.target.value)}
                  className="mr-2"
                />
                8+ days
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold mb-6 text-center">Your Preferences:</h3>

            <div className="flex justify-center mb-4 h-72">
            <Lottie animationData={tripAnimation} loop={true} />
            </div>

            <p className="mb-4 text-center">Trip Preference: {tripPreference}</p>
            <p className="mb-4 text-center">Number of Days: {days}</p>
            <p className="text-gray-500 text-center">Now you will find tour packages based on your preferences</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button 
              onClick={handleBack} 
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
