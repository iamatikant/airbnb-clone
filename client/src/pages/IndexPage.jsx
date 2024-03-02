import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    // axios.get("/places").then((response) => {
    //   setPlaces(response.data);
    // });
    const getPlaces = async () => {
      try {
        const response = await fetch("/places", {
          method: "GET",
          headers: {
            ContentType: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(await response.json());
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaces();
  }, []);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place._id} key={place.title}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <Image
                  className="rounded-2xl object-cover aspect-square"
                  src={place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        ))}
    </div>
  );
}
