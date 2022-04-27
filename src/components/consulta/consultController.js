const Client = require('../client/client.model');
const Doctor = require('../doctor/doctor.model');
const ConsultSchema = require('./consultModel');

const Consult = async (req, res,next) => {
    
        const doctor = await Doctor.findOne(req.params.name);
        console.log(doctor);
        if(!doctor) return res.status(400).send('Doctor not found')
    
        let consult = new ConsultSchema({
            idDoctor: doctor._id,
            tipoConsulta: req.body.tipoConsulta,
            precio: req.body.precio,
        })
    
        consult = await consult.save();
    
        if(!consult) 
        return res.status(500).send('The consult cannot be created')
    
        res.send(consult);


};


module.exports = {Consult}