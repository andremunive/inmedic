const ApiError = require('../../utils/ApiError');
const { enviarCorreoSolicitud } = require('../../config/nodemailer');
const Schedule = require('../client/ScheduleModel2');
//const Schedule2 = require('./ScheduleModel');
const email = require('../../config/nodemailer');
const Doctor = require('../doctor/DoctorModel');

const reject = async(req, res, next) => {
    console.log("algo aca ")
    
    try {
      const appointment = await Schedule.findByIdAndUpdate( req.body.id, {
          status:"rejected",
          reason:req.body.reason
      },
      {
          new:true
      })

      if(appointment){
          try{
            //const doctor =  await Doctor.findOne({ _id:  appointment.idDoctor });
            await email.enviarCorreoCitaRechazada(appointment.email,appointment.id,req.body.reason)
          }catch(err){
            throw new ApiError(err, 400);
          }
          res.json(appointment);
      }else{
          throw new ApiError("Not found", 400);
      }

    } catch (err) {
      next(err);
    }
};

const approve = async(req, res, next) => {

    try {
      const appointment = await Schedule.findByIdAndUpdate( req.body.id, {
          status:"approved"
      },
      {
          new:true
      })

      if(appointment){
          
          const doctor =  await Doctor.findOne({ _id:  appointment.idDoctor });
          
          if(appointment.tipoConsult == 'virtual'){
            await email.enviarCorreoCitaAprobada(appointment.email,appointment,"Link",req.body.url);
          }else{
            await email.enviarCorreoCitaAprobada(appointment.email,appointment,"Dirección",doctor.address+','+doctor.city);
          }
          
          res.json(appointment);

      }else{
          throw new ApiError("Not found", 400);
      }

    } catch (err) {
      next(err);
    }
};

const getAppointmentsByDoctorId = async(req, res, next) => {

    try {
        const { body } = req;

        const doctorId = req.params.doctorId;

        const status = ['pending', 'approved'];

        const appointments = await Schedule.find({ idDoctor: doctorId, status:{$in: status} });
        
        if (!appointments) {
            throw new ApiError("Doctor not found", 400);
        }

        res.status(200).json(appointments);
        
    } catch (err) {
        next(err);
    }

};

const getAppointmentsByClientId = async(req, res, next) => {

    try {

        const clientId = req.params.clientId;

        const status = ['approved', 'rejected'];

        const appointments = await Schedule.find({ idClient: clientId, status:{$in: status} }).populate("idDoctor");
        
        if (!appointments) {
            throw new ApiError("Client not found", 400);
        }

        const response = appointments.map(function(a) {

            const r = {
                doctorName: a.idDoctor.name,
                idCita: a._id,
                status:a.status
            };

            return r;
         })

        res.status(200).json(response);
        
    } catch (err) {
        next(err);
    }

};


module.exports = {
    reject,
    getAppointmentsByDoctorId,
    approve,
    getAppointmentsByClientId
};