import { createContext, useState } from "react";

export const CinemaContext = createContext();

export function CinemaProvider({children}) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [student, setStudent] = useState(0);
    const [adult, setAdult] = useState(0);
    const [senior, setSenior] = useState(0); 

    const value = {
        selectedSeats, setSelectedSeats,
        student, setStudent,
        adult, setAdult,
        senior, setSenior,
    }

    return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>
}