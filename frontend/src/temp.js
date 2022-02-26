import GoogleImageSearch from "free-google-image-search";

GoogleImageSearch.searchImage("cats").then((res) => {
  console.log(res); // This will return array of image URLs
});
