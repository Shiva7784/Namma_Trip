const AddDestinationValidation = (
  destinationID,
  dTitle,
  dDescription,
  dThumbnail,
  extImages,
  dDistrict,
  dProvince,
  longitude,
  latitude
) => {
  const errors = {};

  // Regex for destinationID (Dxxx, where x is 3 digits)
  const destinationIDPattern = /^D\d{3}$/;
  // Title length between 3 and 100 characters
  const titlePattern = /^.{3,100}$/;
  // Description length between 20 and 500 characters
  const descriptionPattern = /^.{20,500}$/;
  // Thumbnail and external images should be strings
  const stringPattern = /^[\w\W]*$/;
  // District and province should be at least 3 characters and only letters
  const districtProvincePattern = /^[A-Za-z\s]{3,}$/;
  // Longitude and latitude patterns
  const longitudePattern = /^-?((1[0-7][0-9])|(0?[0-9][0-9]?))(\.\d+)?$/;
  const latitudePattern = /^-?((1[0-8][0-9])|(0?[0-9][0-9]?))(\.\d+)?$/;

  // Validate destinationID
  if (!destinationIDPattern.test(destinationID)) {
      errors.destinationID = "Destination ID must be in the format Dxxx (x = 3 digits).";
  }

  // Validate title
  if (!titlePattern.test(dTitle)) {
      errors.dTitle = "Title must be between 3 and 100 characters.";
  }

  // Validate description
  if (!descriptionPattern.test(dDescription)) {
      errors.dDescription = "Description must be between 20 and 500 characters.";
  }

  // Validate thumbnail
  if (!stringPattern.test(dThumbnail) || dThumbnail.length === 0) {
      errors.dThumbnail = "Thumbnail must be a valid string.";
  }

  // Validate external images
  if (!stringPattern.test(extImages) || extImages.length === 0) {
      errors.extImages = "Things to do must be valid strings.";
  }

  // Validate district and province
  const validDistricts = [
    "Bengaluru Urban", "Bengaluru Rural", "Ramanagara", "Tumakuru", "Chikkaballapur", "Kolar","Bidadi",
    "Chitradurga", "Davangere", "Shivamogga", "Chikkamagaluru", "Hassan",
    "Mysuru", "Mandya", "Chamarajanagar", "Kodagu",
    "Ballari", "Bidar", "Kalaburagi", "Raichur", "Yadgir", "Koppal", "Vijayapura", "Bagalkot",
    "Belagavi", "Dharwad", "Gadag", "Haveri",
    "Uttara Kannada", "Dakshina Kannada", "Udupi"
];

  const validProvinces = [
      "Western", "Central", "Northern", "Southern", "Eastern", "North Western", "North Central", "Uva",
  ];

  if (!validDistricts.includes(dDistrict)) {
      errors.dDistrict = "Please select a valid district.";
  }

  if (!validProvinces.includes(dProvince)) {
      errors.dProvince = "Please select a valid province.";
  }

  // Validate longitude
  if (!longitudePattern.test(longitude) || longitude < -1000 || longitude > 1000) {
      errors.longitude = "Longitude must be a valid number between -1000 and 1000.";
  }

  // Validate latitude
  if (!latitudePattern.test(latitude) || latitude < -1000 || latitude > 1000) {
      errors.latitude = "Latitude must be a valid number between -1000 and 1000.";
  }

  return errors;
};

export default AddDestinationValidation;
