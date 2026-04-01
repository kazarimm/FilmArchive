import React, { useState, useEffect } from 'react';
import getUserInfo from '../../utilities/decodeJwt';
import WatchlistCard from "./watchlistCard.js";



const WatchListPage = () => {


  const [films, setFilms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching Data...");

      try {
        
        const accessToken = localStorage.getItem("accessToken");
        const user = getUserInfo(accessToken);
        console.log("User Info:", user);
        const userId = user.id;
        console.log("User ID:", userId);

        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/watchlist/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        setFilms(data.films || [])
        console.log("Watchlist Data:", data);
        console.log("Films in Watchlist:", data.films);


      } catch (error) {
        console.error("Error fetching user info:", error);
      }


    };

    fetchData();
  }, []);
  return (
  <div>
    <h1>Your Watchlist</h1>

    <div className="container">
      {films.map((film) => (
        <WatchlistCard key={film._id} film={film} watchedStatus={film.watchedStatus} />
      ))}
    </div>
  </div>
);
};

export default WatchListPage;