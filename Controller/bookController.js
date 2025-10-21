import prisma from "../prisma/prisma.js";

import { searchService } from "../util/service/searchService.js";
import { searchMapper } from "../util/service/searchmapper.js";
import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();




const DoubleCashpayment = async (PaymentData) => {
	try {
		const {
			trip_id1,
			trip_id2,
			date1,
			date2,
			name,
			phone,
			station_from1,
			station_from2,
			station_to1,
			station_to2,
			city_to1,
			city_to2,
			city_from1,
			city_from2,
			chairs1,
			chairs2,
			chairsQTY,
			paymentmethod,
			take_off1,
			take_off2,
			arrive1,
			arrive2,
			discount,
			price,
			oldprice,
			payid,
     	 employeeID ,
		  employeename
			
		} = PaymentData;


			
	if (process.env.SENDGRID_API_KEY) {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	} else {
		throw new Error("SENDGRID_API_KEY is not defined");
	}

		
	
		const ReservedCounter = parseInt(chairsQTY) ;
		
	
		let actucalreservation1;
			const Reservations1 = await prisma.reservation.findFirst({
				where: { trip_date: date1, trip_id: trip_id1 },
			});

			if (!Reservations1) {
				const newReservation1 = await prisma.reservation.create({
					data: {
						trip_id: trip_id1,
						trip_date: date1,
						reservedSeats_counter: ReservedCounter ,
						reservedSeats: chairs1,
					},
				});
				actucalreservation1 = newReservation1;
			} else {
				actucalreservation1 = Reservations1;

				let chairsArray = Reservations1.reservedSeats;

        const chairsArrayy = Array.isArray(chairsArray)
        ? chairsArray.map((route) => Number(route))
        : [];

				chairsArrayy.push(...(chairs1 ));
				const updateReservation1 = await prisma.reservation.update({
					where: { id: Reservations1.id },
					data: {
						reservedSeats_counter: Reservations1.reservedSeats_counter + ReservedCounter ,
						reservedSeats: chairsArrayy,
					},
				});
			}


			let actucalreservation2;
			const Reservations2 = await prisma.reservation.findFirst({
				where: { trip_date: date2, trip_id: trip_id2 },
			});
			if (!Reservations2) {
				const newReservation2 = await prisma.reservation.create({
					data: {
						trip_id: trip_id2,
						trip_date: date2,
						reservedSeats_counter: ReservedCounter ,
						reservedSeats: chairs2,
					},
				});
				actucalreservation2 = newReservation2;
			} else {
				actucalreservation2 = Reservations2;

				let chairsArray = Reservations2.reservedSeats ;

        const chairsArrayy = Array.isArray(chairsArray)
        ? chairsArray.map((route) => Number(route))
        : [];

				chairsArrayy.push(...(chairs2 ));
				const updateReservation2 = await prisma.reservation.update({
					where: { id: Reservations2.id },
					data: {
						reservedSeats_counter: Reservations2.reservedSeats_counter + ReservedCounter ,
						reservedSeats: chairsArrayy ,
					},
				});
			}
	
			let actualCoustmer;
			const Coustmer = await prisma.coustmer.findUnique({
				where: { phone: phone },
			});
			if (!Coustmer) {
				const NewCoustmer = await prisma.coustmer.create({
					data: { name: name, phone: phone },
				});
				actualCoustmer = NewCoustmer;
			} else {
				actualCoustmer = Coustmer;
			}
		
	
			const NewTicket = await prisma.ticket.create({
				data: {
					trip_id: trip_id1,
					Back_trip_id:trip_id2,
					pay_id : payid ,
					trip_date: date1,
					Back_trip_date:date2,
					Coustmer_id: actualCoustmer.id,
					status: "Booked",
					paymentMethod: paymentmethod,
					seatsCounter: ReservedCounter ,
					seats: chairs1,
					Backseats: chairs2,
					reservation_id: actucalreservation1.id,
					Backreservation_id:actucalreservation2.id,
					
			CityRoutes:[city_from1 , city_to1] ,
			Back_CityRoutes:[city_from2 , city_to2] ,
			StationRoutes:[station_from1,station_to1],
			Back_StationRoutes:[station_from2,station_to2],
			takeoff: take_off1 ,
			Back_takeoff:take_off2,
			arrive : arrive1,
			Back_arrive:arrive2,
			price : price,
      book_id : employeeID
			
				},
			});

			
		const firstStation1 = await prisma.station.findFirst({
			where: {name: station_from1} , select: {Arabicname: true}
		} );
		const secondStation1 = await prisma.station.findFirst({
			where: {name: station_to1} , select: {Arabicname: true}
		});
		const TAKEOFFTYPE1 = take_off1.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً` 
		const TAKEOFF1 = `${take_off1.split(" ")[0]} ${TAKEOFFTYPE1}`
		const ARRIVETYPE1 = arrive1.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً`
		const ARRIVE1 = `${arrive1.split(" ")[0]} ${ARRIVETYPE1}`

		const firstStation2 = await prisma.station.findFirst({
			where: {name: station_from2} , select: {Arabicname: true}
		} );
		const secondStation2 = await prisma.station.findFirst({
			where: {name: station_to2} , select: {Arabicname: true}
		});
		const TAKEOFFTYPE2 = take_off2.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً` 
		const TAKEOFF2 = `${take_off2.split(" ")[0]} ${TAKEOFFTYPE2}`
		const ARRIVETYPE2 = arrive2.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً`
		const ARRIVE2 = `${arrive2.split(" ")[0]} ${ARRIVETYPE2}`

		const whatsapp = await prisma.whatsapp.findFirst();

		const data = {
			client_id: `${whatsapp.client}`,
			mobile: `+2${actualCoustmer.phone}`,
			text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter}
نوع التذكرة: ذهاب و عودة
كراسي الذهاب: ${NewTicket.seats}
كراسي العودة: ${NewTicket.Backseats}




تفاصيل رحلة الذهاب:
محطة الركوب ${firstStation1?.Arabicname} الساعه${TAKEOFF1} بتاريخ ${date1}
محطة الوصول ${secondStation1?.Arabicname}  الساعه ${ARRIVE1} 

تفاصيل رحلة العودة:
محطة الركوب ${firstStation2?.Arabicname} الساعه${TAKEOFF2} بتاريخ ${date2}
محطة الوصول ${secondStation2?.Arabicname}  الساعه ${ARRIVE2}

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`
		};


		const whatsappMSG = await fetch(
			"https://v2.whats360.live/api/user/v2/send_message",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						`Bearer ${whatsapp.token}`,
				},
				body: JSON.stringify(data),
			}
		);



			const msg = {
				to: 'dahabawybus@gmail.com',
				from: 'bassela.sallam@gmail.com',
				subject: `🚌 New Cash Double Reservation from an agent (#${NewTicket.ticket_code})`,
				html: `
				<div style="font-family:Arial, sans-serif;max-width:650px;margin:auto;background:#f7f7f7;padding:20px;border-radius:10px;">
				  <h2 style="color:#333;">🎟️ New Double Reservation Received!</h2>
				  <p>You've received a new <strong>cash reservation (Round Trip)</strong>. Here are the complete details:</p>
			  
				  <h3 style="color:#007bff;">➡️ Going Trip</h3>
				  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr><td><strong>Trip Date:</strong></td><td>${date1}</td></tr>
					<tr><td><strong>Departure:</strong></td><td>${take_off1}</td></tr>
					<tr><td><strong>Arrival:</strong></td><td>${arrive1}</td></tr>
					<tr><td><strong>Route:</strong></td><td>${city_from1} → ${city_to1}</td></tr>
					<tr><td><strong>Stations:</strong></td><td>${station_from1} → ${station_to1}</td></tr>
					<tr><td><strong>Seats Reserved:</strong></td><td>${ReservedCounter} (${chairs1})</td></tr>
				  </table>
			  
				  <h3 style="color:#28a745;">⬅️ Return Trip</h3>
				  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
					<tr><td><strong>Trip Date:</strong></td><td>${date2}</td></tr>
					<tr><td><strong>Departure:</strong></td><td>${take_off2}</td></tr>
					<tr><td><strong>Arrival:</strong></td><td>${arrive2}</td></tr>
					<tr><td><strong>Route:</strong></td><td>${city_from2} → ${city_to2}</td></tr>
					<tr><td><strong>Stations:</strong></td><td>${station_from2} → ${station_to2}</td></tr>
					<tr><td><strong>Seats Reserved:</strong></td><td>${ReservedCounter} (${chairs2})</td></tr>
				  </table>
			  
				  <h3 style="color:#333;">📌 Customer & Payment Info</h3>
				  <table style="width:100%;border-collapse:collapse;">
					<tr><td><strong>Ticket Number:</strong></td><td>#${NewTicket.ticket_code}</td></tr>
					<tr><td><strong>Customer Name:</strong></td><td>${actualCoustmer.name}</td></tr>
					<tr><td><strong>Customer Phone:</strong></td><td>${actualCoustmer.phone}</td></tr>
					<tr><td><strong>Total Price:</strong></td><td>${price}</td></tr>
					<tr><td><strong>Payment Method:</strong></td><td>${paymentmethod}</td></tr>
					<tr><td><strong>Agent Name:</strong></td><td>${employeename}</td></tr>
					
				  </table>
			  
				  <p style="margin-top:20px;">
					Please follow up promptly to confirm the payment and finalize this double reservation.
				  </p>
				  <p style="color:#888;font-size:12px;">
					This is an automated message from your booking system.
				  </p>
				</div>
				`,
			  };
			  

  await sgMail.send(msg) ;
  
	}
	
	catch(error){
		console.log(error) ;
	 }
	}
	



const Cashpayment = async (PaymentData) => {
    try {
        const {
            trip_id,
            date,
            name,
            phone,
            station_from,
            station_to,
            city_to,
            city_from,
            chairs,
            chairsQTY,
            voucher,
            paymentmethod,
            take_off,
            arrive,
            price,
            payid ,
            employeeID ,
			employeename
        } = PaymentData ;

        
    
        const ReservedCounter = parseInt(chairsQTY) ;
    
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        } else {
            throw new Error("SENDGRID_API_KEY is not defined");
        }
        
    
    
        let actucalreservation;
            const Reservations = await prisma.reservation.findFirst({
                where: { trip_date: date, trip_id: trip_id },
            });
            if (!Reservations) {
                const newReservation = await prisma.reservation.create({
                    data: {
                        trip_id: trip_id,
                        trip_date: date,
                        reservedSeats_counter: ReservedCounter ,
                        reservedSeats: chairs,
                    },
                });
                actucalreservation = newReservation;
            } else {
                actucalreservation = Reservations;

                let chairsArray = Reservations.reservedSeats ;

                const chairsArrayy = Array.isArray(chairsArray)
                ? chairsArray.map((route) => Number(route))
                : [];
              

                chairsArrayy.push(...(chairs));
               
                
                const updateReservation = await prisma.reservation.update({
                    where: { id: Reservations.id },
                    data: {
                        reservedSeats_counter: Reservations.reservedSeats_counter + ReservedCounter ,
                        reservedSeats: chairsArrayy,
                    },
                });
            }
    
            let actualCoustmer;
            const Coustmer = await prisma.coustmer.findUnique({
                where: { phone: phone },
            });
            if (!Coustmer) {
                const NewCoustmer = await prisma.coustmer.create({
                    data: { name: name, phone: phone },
                });
                actualCoustmer = NewCoustmer;
            } else {
                actualCoustmer = Coustmer;
            }
        let actualvoucher;
        if(voucher.length > 0) {
          const usedvoucher = await prisma.voucher.findUnique({where:{code:voucher}}) ;
          actualvoucher = usedvoucher ;
          await prisma.voucher.update({where:{id:usedvoucher?.id}, data: {consumed: {increment: 1}}});
        }
    
            const NewTicket = await prisma.ticket.create({
                data: {
                    trip_id: trip_id,
                    pay_id : payid ,
                    trip_date: date,
                    Coustmer_id: actualCoustmer.id,
                    status: "Booked",
                    paymentMethod: paymentmethod,
                    seatsCounter: ReservedCounter ,
                    seats: chairs,
                    reservation_id: actucalreservation.id,
            CityRoutes:[city_from , city_to] ,
            StationRoutes:[station_from,station_to],
            voucher_id: actualvoucher?.id || null, 
            takeoff: take_off ,
            arrive : arrive,
            price : price,
            book_id : employeeID
           
            
                },
            });

				const firstStation = await prisma.station.findFirst({
			where: {name: station_from} , select: {Arabicname: true}
		} );
		const secondStation = await prisma.station.findFirst({
			where: {name: station_to} , select: {Arabicname: true}
		});
		const TAKEOFFTYPE = take_off.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً` 
		const TAKEOFF = `${take_off.split(" ")[0]} ${TAKEOFFTYPE}`
		const ARRIVETYPE = arrive.split(" ")[1] === "AM" ? 'صباحاً' : `مساءً`
		const ARRIVE = `${arrive.split(" ")[0]} ${ARRIVETYPE}`

		const whats = await prisma.whatsapp.findFirst();

		const data = {
			client_id: `${whats.client}` ,
			mobile: `+2${actualCoustmer.phone}`,
			text: `تم حجز تذكرتك بنجاح و رقم التذكرة هو ${NewTicket.ticket_code}
ب اسم ${actualCoustmer.name}
تليفون ${actualCoustmer.phone}
وسيلة الدفع ${NewTicket.paymentMethod}
سعر التذكرة ${NewTicket.price} جنيه
عدد المسافرين : ${NewTicket.seatsCounter} 
نوع التذكرة: ذهاب فقط 
كراسي الذهاب: ${NewTicket.seats}


تفاصيل الرحلة:
محطة الركوب ${firstStation?.Arabicname} الساعه${TAKEOFF} بتاريخ ${date}
محطة الوصول ${secondStation?.Arabicname}  الساعه ${ARRIVE} 

برجاء الاحتفاظ بالتذكرة: 
https://www.swiftbusegypt.com/ticket?id=${NewTicket.pay_id}`
		};

		const whatsappMSG = await fetch(
			"https://v2.whats360.live/api/user/v2/send_message",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						`Bearer ${whats.token}`,
				},
				body: JSON.stringify(data),
			}
		);
    
            
    const msg = {
        to: 'dahabawybus@gmail.com',
        from: '	bassela.sallam@gmail.com',
        subject: `🚌 New Cash Single Reservation from an agent (#${NewTicket.ticket_code})`,
        html: `
        <div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;background:#f7f7f7;padding:20px;border-radius:10px;">
          <h2 style="color:#333;">🎟️ New Reservation Received!</h2>
          <p>You've received a new <strong>cash reservation</strong>. Here are the details:</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Ticket Number:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">#${NewTicket.ticket_code}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Trip ID:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${trip_id}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Customer name:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${actualCoustmer.name}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Customer phone:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${actualCoustmer.phone}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Trip Date:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${date}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Departure:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${take_off}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Arrival:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${arrive}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Route:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${city_from} → ${city_to}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Stations:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${station_from} → ${station_to}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Seats Reserved:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${ReservedCounter} (${chairs})</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Voucher:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${actualvoucher?.code || 'None'}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Total Price:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${price}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Payment Method:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${paymentmethod}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Agent Name:</strong></td>
              <td style="padding:8px;border-bottom:1px solid #ddd;">${employeename}</td>
            </tr>
          </table>
          <p style="margin-top:20px;">
            Please follow up to confirm payment and finalize this reservation.
          </p>
          <p style="color:#888;font-size:12px;">
            This is an automated message from your booking system.
          </p>
        </div>
        `,
      };
    
      await sgMail.send(msg) ;
      
    }
    
    catch(error){
        console.log(error) ;
     }
    }
    


export const ViewBookpage = async (req , res , next) => {

    try {
        const Markting = await prisma.marktingLines.findMany({
            select: { Arabiccity: true, Arabicsubtitle: true, image_path: true },
        });
        const citywithstations = await prisma.city.findMany({
            where: { isDeleted: false },
            select: {
            Arabicname: true,
            stations: {
                where: { isDeleted: false },
                select: {
                Arabicname: true,
                name: true,
                },
            },
            },
        });
        const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
        const footerinfo = await prisma.info.findFirst();
        const arabicfreqquestion = await prisma.freqQuestionsArabic.findFirst({
            select: { Questions: { select: { question: true, answer: true } } },
        });

        
        res.render("BookPage", {
            Markting,
            ArabicFrontpage,
            citywithstations,
            arabicfreqquestion,
            footerinfo,
        });
    } catch (error) {
        next(error);
    }
};




export const Searchresult = async (
	req , res , next
) => {
	try {
		const { travel_date , back_date , radio , first_choice, second_choice , qty } = req.body;
		//console.log(travel_date , back_date , radio , first_choice , second_choice , qty);
		
		

		if (!travel_date || !first_choice || !second_choice || !qty) {
			return res.redirect('/') ;
		}

		if (travel_date && back_date && radio == 'twoWay') {
			const DATEGO = new Date(travel_date);
			const DATEBACK = new Date(back_date);
			if (travel_date > back_date) {
				return res.redirect('/') ;
			}
		}

		const searchresultGo = await searchService(
			travel_date,
			first_choice ,
			second_choice,
			qty 
		);


		const GoResult = await searchMapper(
			searchresultGo,
			first_choice ,
			second_choice ,
			travel_date ,
			qty 
		);
		
	


	

		let BackResult = [];

		if (radio === "twoWay" && !back_date) {
			return res.redirect('/') ;
		}

		if (radio === "twoWay" && back_date) {
			const searchresultBack = await searchService(
				back_date ,
				second_choice ,
				first_choice ,
				qty 
			)

			if (radio === "twoWay" && back_date) {	
			BackResult = await searchMapper(
				searchresultBack,
				second_choice ,
				first_choice ,
				back_date ,
				qty 
			);
		 }
		}	

		const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
		const footerinfo = await prisma.info.findFirst();
	
		
		if(radio === "oneWay") {
			return res.render("book_trips" , {GoResult , radio , qty , ArabicFrontpage , footerinfo}) ;
		}

		return res.render("book_trips" , {GoResult , BackResult , radio , qty , ArabicFrontpage , footerinfo}) ;
		
		
	
	} catch (error) {
		console.error(error);
	}
};


    



export const SelectSingleTrip = async (req , res , next) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive } = req.body;
    const Data = req.body ;
    
   
   

    const [month, day, year] = Data.trip_date.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const footerinfo = await prisma.info.findFirst();
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst();
   
        res.render("signlechair" , {Data , Reservations , vouchers , paymentMethods , tempReservation , footerinfo , ArabicFrontpage} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}





export const SelectdoubleTrip = async (req , res , next) => {
    try {

    //const { trip_id, trip_date, bus_type, trip_day, trip_takeoff, trip_from, trip_to, trip_fare, trip_specialfare , city_from, city_to, payment , chairsNumber , trip_arrive , twowaydiscount } = req.body;
    const Data = req.body ;
 
 
  
   
   

    const [month, day, year] = Data.trip_date1.split('/');
    const formattedDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

    const [month2, day2, year2] = Data.trip_date2.split('/');
    const formattedDate2 = new Date(`${year2}-${month2}-${day2}`).toISOString().split('T')[0];

    const paymentMethods = Data.payment1.split(',');


    const Reservations = await prisma.reservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const Reservations2 = await prisma.reservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const tempReservation = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate , trip_id : Data.trip_id1}});
    const tempReservation2 = await prisma.tempReservation.findFirst({where : {trip_date : formattedDate2 , trip_id : Data.trip_id2}});
    const vouchers = await prisma.voucher.findMany({ where: { consumed: { lt: prisma.voucher.fields.avaliable } , isActive: true }});
    const ArabicFrontpage = await prisma.frontpageArabic.findFirst() ;
    const footerinfo = await prisma.info.findFirst() ;
   
        res.render("doublechair" , {Data , Reservations , Reservations2, vouchers , paymentMethods , tempReservation , tempReservation2 , ArabicFrontpage , footerinfo} ) ;
    }
    catch(error){
        console.log(error) ;
        res.redirect('/') ;
    }
}





export const paymobPay = async (
	req,
	res,
	next
) => {
	try {
		const {
			action,
			name,
			phone,
			trip_id,
			date,
			station_from,
			station_to,
			voucher,
			chairs,
			chairsQTY,
			city_from,
			city_to,
			take_off,
			arrive,
		} = req.body;

        const {employeeID } = req.user ;
		
		const loweraction = action.toLowerCase();
		const pk_key = process.env.pk_key;
		const ReservedChairs = JSON.parse(chairs);

	// Convert godate from MM/DD/YYYY to YYYY-MM-DD
	const [month, day, year] = date.split("/");
	const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	
		const Trip = await prisma.trip.findUnique({where: {id:trip_id},include:{Bus:true}});

		const cityfrom = await prisma.city.findUnique({
			where: { name: city_from },
		});
		const cityto = await prisma.city.findUnique({ where: { name: city_to } });

		//go back if there is reservation with the same seat
		const OldReservations = await prisma.reservation.findFirst({
			where: { trip_id: trip_id, trip_date: formattedDate },
		});
		if (OldReservations) {
			const reservedSeatsArray = OldReservations.reservedSeats;
			const isReserved = ReservedChairs.some((chair) =>
				reservedSeatsArray.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id, trip_date: formattedDate },
		});
		if (OldtempReservations) {
			const reservedSeatsArray = OldtempReservations.reservedSeats;
			const isReserved = ReservedChairs.some((chair) =>
				reservedSeatsArray.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}


		// const isFingerprint = await prisma.fingerprint.findUnique({where : {fingerprint : req.fingerprint?.hash}});
		// if(isFingerprint) {
		// 	 return res.render("wait") ;
		// }

		

		const cost = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id,
				fromCityId: cityfrom?.id,
				toCityId: cityto?.id,
			},
		});
		let totalprice;
		if(ReservedChairs.includes(1) && Trip?.Bus.type == "HI-ACE") {
			const Diffrence = (cost?.specialfare || 1) - (cost?.fare || 1) ;
			totalprice = cost.fare * chairsQTY + Diffrence;
		}else {
			totalprice = cost.fare * chairsQTY;
		}
		let finalprice = totalprice;
		if (voucher.length > 0) {
			const DBvoucher = await prisma.voucher.findUnique({
				where: { code: voucher, isActive: true },
			});
			if (DBvoucher) {
				const discount = totalprice * (DBvoucher.percentage / 100);
				finalprice =
					discount > DBvoucher.maximum
						? totalprice - DBvoucher.maximum
						: totalprice - discount;
			}
		}

	
		
			let payid = Date.now() * 1000 + Math.floor(Math.random() * 1000) ;
			const paymentData = {
					trip_type:"single",
					trip_id: trip_id,
					date: formattedDate,
					name: name,
					phone: phone,
					station_from: station_from,
					station_to: station_to,
					city_to: city_to,
					city_from: city_from,
					chairs: ReservedChairs,
					chairsQTY: chairsQTY,
					voucher: voucher,
					paymentmethod: action,
					take_off: take_off,
					arrive: arrive,
					price:finalprice,
					payid: payid ,
                    employeeID : employeeID ,
					employeename: req.user.name ,
			}
			await Cashpayment(paymentData) ;
			return res.redirect(`https://www.swiftbusegypt.com/ticket?id=${payid}`) ;
		

	} catch (error) {
		console.log(error);
		next(error);
	}
};




export const doublepaymobPay = async (
	req,
	res,
	next
) => {
	try {
		const {
			action,
			name,
			phone,
			trip_id1,
			trip_id2,
			date1,
			date2,
			station_from1,
			station_from2,
			station_to1,
			station_to2,
			chairs1,
			chairs2,
			chairsQTY,
			city_from1,
			city_from2,
			city_to1,
			city_to2,
			take_off1,
			take_off2,
			arrive1,
			arrive2,
		} = req.body;

    const {employeeID} = req.user ;

	
		
		const loweraction = action.toLowerCase();
		const pk_key = process.env.pk_key;
		const ReservedChairs1 = JSON.parse(chairs1);
		const ReservedChairs2 = JSON.parse(chairs2);

	// Convert godate from MM/DD/YYYY to YYYY-MM-DD
	const [month1, day1, year1] = date1.split("/");
	const formattedDate1 = `${year1}-${month1.padStart(2, "0")}-${day1.padStart(2, "0")}`;

	const [month2, day2, year2] = date2.split("/");
	const formattedDate2 = `${year2}-${month2.padStart(2, "0")}-${day2.padStart(2, "0")}`;
	
		const Trip1 = await prisma.trip.findUnique({where: {id:trip_id1},include:{Bus:true}});

		const Trip2 = await prisma.trip.findUnique({where: {id:trip_id2},include:{Bus:true}});

		const cityfrom1 = await prisma.city.findUnique({
			where: { name: city_from1 },
		});

		
		const cityfrom2 = await prisma.city.findUnique({
			where: { name: city_from2 },
		});
		
		const cityto1 = await prisma.city.findUnique({ where: { name: city_to1 } });

		const cityto2 = await prisma.city.findUnique({ where: { name: city_to2 } });

		
		//go back if there is reservation with the same seat
		const OldReservations1 = await prisma.reservation.findFirst({
			where: { trip_id: trip_id1, trip_date: formattedDate1 },
		});

		if (OldReservations1) {
			const reservedSeatsArray = OldReservations1.reservedSeats;
			const isReserved = ReservedChairs1.some((chair) =>
				reservedSeatsArray.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldReservations2 = await prisma.reservation.findFirst({
			where: { trip_id: trip_id2, trip_date: formattedDate2 },
		});

		if (OldReservations2) {
			const reservedSeatsArray = OldReservations2.reservedSeats;
			const isReserved = ReservedChairs2.some((chair) =>
				reservedSeatsArray.includes(chair)
			);
			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations1 = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id1, trip_date: formattedDate1 },
		});
		if (OldtempReservations1) {
			const reservedSeatsArray = OldtempReservations1.reservedSeats;
			const isReserved = ReservedChairs1.some((chair) =>
				reservedSeatsArray.includes(chair)
			);

			if (isReserved) {
				return res.redirect("/");
			}
		}

		//go back if there is reservation with the same seat
		const OldtempReservations2 = await prisma.tempReservation.findFirst({
			where: { trip_id: trip_id2, trip_date: formattedDate2 },
		});
		if (OldtempReservations2) {
			const reservedSeatsArray = OldtempReservations2.reservedSeats;
			const isReserved = ReservedChairs2.some((chair) =>
				reservedSeatsArray.includes(chair)
			);

			if (isReserved) {
				return res.redirect("/");
			}
		}

		
		// const isFingerprint = await prisma.fingerprint.findUnique({where : {fingerprint : req.fingerprint?.hash}});
		// if(isFingerprint) {
		// 	 return res.render("wait") ;
		// }


		const cost1 = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id1,
				fromCityId: cityfrom1?.id,
				toCityId: cityto1?.id,
			},
		});

		const cost2 = await prisma.cost.findFirst({
			where: {
				trip_id: trip_id2,
				fromCityId: cityfrom2?.id,
				toCityId: cityto2?.id,
			},
		});

		let totalprice;

		if(ReservedChairs1.includes(1) && Trip1?.Bus.type == "HI-ACE") {
			const Diffrence = (cost1?.specialfare || 1) - (cost1?.fare || 1) ;
			totalprice = cost1.fare * chairsQTY + Diffrence;
		}else {
			totalprice = cost1.fare * chairsQTY;
		}

		if(ReservedChairs2.includes(1) && Trip2?.Bus.type == "HI-ACE") {
			const Diffrence = (cost2?.specialfare || 1) - (cost2?.fare || 1) ;
			totalprice = totalprice +  cost2.fare * chairsQTY + Diffrence;
		}else {
			totalprice =  totalprice + cost2.fare * chairsQTY;
		}

		let finalprice = totalprice;

		let actualdiscount = (cost1?.twowaydiscount || 0 ) < (cost2?.twowaydiscount || 0) ? cost1?.twowaydiscount : cost2?.twowaydiscount;

		if ((actualdiscount ?? 0) > 0) {
			finalprice = totalprice * (100 - (actualdiscount ?? 0)) / 100;
		}

	
		
			let payid = Date.now() * 1000 + Math.floor(Math.random() * 1000) ;
			const paymentData = {
					trip_type:"double",
					trip_id1: trip_id1,
					trip_id2: trip_id2,
					date1: formattedDate1,
					date2: formattedDate2,
					name: name,
					phone: phone,
					station_from1: station_from1,
					station_from2: station_from2,
					station_to1: station_to1,
					station_to2: station_to2,
					city_to1: city_to1,
					city_to2: city_to2,
					city_from1: city_from1,
					city_from2: city_from2,
					chairs1: ReservedChairs1,
					chairs2: ReservedChairs2,
					chairsQTY: chairsQTY,
					paymentmethod: action,
					take_off1: take_off1,
					take_off2: take_off2,
					arrive1: arrive1,
					arrive2: arrive2,
					oldprice:totalprice,
					discount:actualdiscount,
					price:finalprice,
					payid: payid,
          employeeID : employeeID,
		  employeename: req.user.name 
			}

			await DoubleCashpayment(paymentData) ;
			return res.redirect(`https://www.swiftbusegypt.com/ticket?id=${payid}`) ;
		
	} catch (error) {
		next(error);
	}
};









