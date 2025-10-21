import { name } from "ejs";



export const AgentMapper = async (Agent) => {

    let neededcommetions = 0;
    let totalsales = 0;
    let cash = 0 ;
    let wallet = 0 ;
    let visa = 0 ;

    const AgentTickets = Agent.tickets_id.map(ticket => {

        let trip_type = ticket.Back_trip_id ? "Two Way" : "One Way";

        if(ticket.status === "Booked" || ticket.status === "Absent") {
            
            totalsales += ticket.price;
            if(ticket.paymentMethod === "cash") cash += ticket.price ;
            if(ticket.paymentMethod === "visa") visa += ticket.price ;
            if(ticket.paymentMethod === "VFcash") wallet += ticket.price ;     
        }
       

        return {
            ticketNumber: ticket.ticket_code ,
            status: ticket.status ,
            trip_type: trip_type ,
            seatsCounter: ticket.seatsCounter ,
            city_Routes : ticket.CityRoutes ,
            station_Routes: ticket.StationRoutes ,
            trip_date: ticket.trip_date ,
            price: ticket.price ,
            coustmer_name : ticket.CoustmerID.name ,
            coustmer_phone : ticket.CoustmerID.phone ,
            paymentMethod: ticket.paymentMethod ,
            cancelled_by : ticket.CancelEmployeeID ? ticket.CancelEmployeeID.name : null ,
            cancel_reason : ticket.cancelReason

        }
    });

    neededcommetions = totalsales * (Agent.percentage / 100);

    return {
        id: Agent.id ,
        name: Agent.name ,
        phone: Agent.phone ,
        address: Agent.address ,
        percentage: Agent.percentage ,
        totalsales: totalsales,
        neededcommetions: neededcommetions ,
        setteled: Agent.setteled ,
        cash:cash ,
        visa : visa ,
        wallet : wallet ,
        tickets: AgentTickets 
    }


}