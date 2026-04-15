import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

const Landingpage = () => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, 3000); // match gif length (ms)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        {/* GIF / PNG */}
        <div className="w-[1000px]">
          <img
            src={done ? "/FALOGONO2.png" : "/FALOGONO.GIF"}
            alt="Animation"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Card */}
        <Card style={{ width: "30rem" }} className="mx-2 my-2">
          <Card.Body>
            <Card.Title>Welcome to Film Archive (Placeholder)</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              
            </Card.Subtitle>
            <Card.Text>
             
            </Card.Text>
            <Card.Link href="/signup">Sign Up</Card.Link>
            <Card.Link href="/login">Login</Card.Link>
          </Card.Body>
        </Card>

      </div>
    </div>
  );
};

export default Landingpage;