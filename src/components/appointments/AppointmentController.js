const ApiError = require('../../utils/ApiError');
const { enviarCorreoSolicitud } = require('../../config/nodemailer');
const Schedule = require('../client/ScheduleModel2');
//const Schedule2 = require('./ScheduleModel');
const email = require('../../config/nodemailer');
const Doctor = require('../doctor/DoctorModel');

const reject = async(req, res, next) => {
    try {
      const appointment = await Schedule.findByIdAndUpdate( req.body.id, {
          status:"reject",
          reason:req.body.reason
      },
      {
          new:true
      })

      if(appointment){
          try{
            const doctor =  await Doctor.findOne({ _id:  appointment.idDoctor });
            await email.enviarCorreoCitaRechazada(appointment.email,appointment.id,doctor.name)
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

const getAppointmentsByDoctorId = async(req, res, next) => {

    try {
        const { body } = req;

        req.isRole('user');

        const doctorId = req.params.doctorId;

        console.log("doctor id: "+doctorId)

        const appointments = await Schedule.find({ idDoctor: doctorId, status:'pending' });
        
        if (!appointments) {
            throw new ApiError("Doctor not found", 400);
        }

        res.status(200).json(appointments);
        
    } catch (err) {
        next(err);
    }

};


module.exports = {
    reject,
    getAppointmentsByDoctorId
};