document.addEventListener('DOMContentLoaded', function () {
  const coordinates = window.coordinates;
  
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    console.error("Invalid coordinates:", coordinates);
    return; 
  }

  mapboxgl.accessToken = "pk.eyJ1IjoibWFsaWtodXo5IiwiYSI6ImNtN3VlaHM0ZDAyd3IyanMybmk4eW00MTQifQ._vYZ3dlEvJ5smz6oEl8ixg";

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 12
  });

  map.on('load', function () {
    new mapboxgl.Marker({color: "red"})
      .setLngLat(coordinates)
      .addTo(map);
  });

  const stars = document.querySelectorAll(".rating-star");
  const ratingInput = document.getElementById("rating");

  if (stars.length === 0 || !ratingInput) {
    console.error("Rating elements not found.");
    return;
  }

  stars.forEach((star, index) => {
    star.addEventListener("click", function () {
      const value = index + 1;
      ratingInput.value = value;

      stars.forEach((s, i) => {
        s.classList.toggle("active", i < value);
      });
    });

    star.addEventListener("mouseover", function () {
      stars.forEach((s, i) => {
        s.classList.toggle("hover", i < index + 1);
      });
    });

    star.addEventListener("mouseout", function () {
      stars.forEach((s) => s.classList.remove("hover"));
    });
  });
});
