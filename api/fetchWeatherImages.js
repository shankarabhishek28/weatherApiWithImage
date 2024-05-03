import axios from 'axios';

// Function to fetch images from Unsplash based on weather condition
const fetchWeatherImages = async (weatherCondition) => {
  try {
    // Make API request to Unsplash
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: weatherCondition, 
        client_id: '_TXCaAihoUtx_jo2KC1gzG_Sdthr5GetLFFKNWNeuIo', 
      },
    });

    // Extract image URLs from the response
    const imageUrls = response.data.results.map(result => result.urls.regular);

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export default fetchWeatherImages;
