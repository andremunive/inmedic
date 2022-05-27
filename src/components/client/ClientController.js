const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
const bcrypt = require("bcryptjs");
const ApiError = require('../../utils/ApiError');
const UserSerializer = require('../../Serializers/UserSerializer');
const { enviarCorreoSolicitud } = require('../../config/nodemailer');
const ReviewSchema = require('./ReviewModel');
const ConsultModel = require('../doctor/ConsultModel');
const ConsultSerializer = require('../../Serializers/ConsultSerializer');
const Schedule = require('./ScheduleModel2');
//const Schedule2 = require('./ScheduleModel');

const clientSignup = async(req, res, next) => {
    try {
        //Get user input

        const input = { name, lastName, documentNumber, phoneNumber, address, gender, email, password, birthDate, role } = req.body;
        let inputArray = Object.keys(input);

        // Validate user input
        if (inputArray.every((ele) => input[ele] != "" && input[ele] != undefined)) {} else {
            throw new ApiError("All input is required", 400);
        }
        //   if (password !== passwordConfirmation) {
        //      throw new ApiError("Passwords do not match",400);
        //     }

        // Validamos la existencia del usuario en la base de datos
        let oldUser;
        await Client.findOne({ email: input.email }).then((client) => {
            oldUser = client;
        }).catch((error) => {
            console.log(error)
        })


        if (oldUser != null) {
            throw new ApiError("User Already Exist. Please Login", 400);
        }

        // Encrypt user password
        let encryptedPassword;
        await bcrypt.hash(input.password, 10).then((resul) => {
            encryptedPassword = resul
        }).catch((error) => {
            console.log("Encripting Error", error)
        })

        // Creamos un usuario en la DB
        let _client;
        await Client.create({
            name,
            lastName,
            documentNumber,
            phoneNumber,
            address,
            gender,
            email,
            password: encryptedPassword,
            birthDate,
            role
        }).then((client) => {
            _client = client
            res.status(200).json(new UserSerializer(_client));
        }).catch((error) => {
            console.log(error)
        })

    } catch (err) {
        next(err);
    }
};


const GetServices = async(req, res, next) => {

    try {
        const { body } = req;
        req.isRole('user');
        console.log("search: ", body.search);
        console.log("city: ", body.city);

        const userPayload = {
            search: body.search,
            city: body.city
        };

        if (Object.values(userPayload).every((val) => val === "")) {
            throw new ApiError('Fields not complete', 400);
        }

        const doctorBySpecialization = await Doctor.find({
            specialization: { $regex: body.search.trim(), $options: "$i" },
            city: { $regex: body.city.trim(), $options: "i" }
        });

        const doctorByName = await Doctor.find({
            name: { $regex: body.search.trim(), $options: "$i" },
            city: { $regex: body.city.trim(), $options: "i" }
        });

        const doctorByServices = await Doctor.find({
            services: { $regex: body.search.trim(), $options: "$i" },
            city: { $regex: body.city.trim(), $options: "i" }
        });

        let doctor = [];
        doctor = doctorByServices.length ? doctorByServices : doctor;
        console.log("Services: ", doctor);
        doctor = doctorByName.length ? doctorByName : doctor;
        console.log("Name: ", doctor);
        doctor = doctorBySpecialization.length ? doctorBySpecialization : doctor;
        console.log("Specialization: ", doctor);

        let resultConsults = [];
        let myIndex = 0;

        if (doctor.length === 0) {

            res.status(200).json({status: "User not found", data: null});

        }

        doctor.forEach(async(doc) => {
            await ConsultModel.find({ name: doc.name }).then((profileSearch) => {
                resultConsults = [...resultConsults, ...profileSearch];
                myIndex += 1;
                console.log("profileDoctor", resultConsults);

                if (myIndex === doctor.length) {

                    // if (resultConsults.length === 0 ) {
                    //   res.json({status: "user not found", data: null});
                    // } else {
                    res.json(new ConsultSerializer(resultConsults));
                    //}
                }
            })
        })
    } catch (err) {
        next(err);
    }
};

const ProfileDoctor = async(req, res, next) => {

    try {
        const { params } = req;
        req.isRole('user');

        const profileDoctor = await ConsultModel.find({ idDoctor: params.idDoctor });
        console.log("Profile doctor: ", profileDoctor);
        //console.log("_id: ", profileDoctor);

        if (!profileDoctor) return new ApiError("Profile doctor not found", 400);

        const review = await ReviewSchema.find({idDoctor: params.idDoctor }, {_id:0, idDoctor: 0});
        console.log("Review: ",review);



        res.status(200).json({profileDoctor});

    } catch (err) {
        next(err);
    }
};

const AgendarCita = async (req, res, next) => {

  try {
    const { body } = req;
    const userId = req.user;
    console.log("UseID: ", userId);
    const user = await Client.findOne({ _id:  userId.id });
    const doctor = await Doctor.findOne({ _id:  body.idDoctor });
    console.log("DOCTOR: ", doctor);
    

    const userPayload = {
        idDoctor: doctor._id,
        name: body.name,
        DocumentNumber: body.DocumentNumber,
        edad: body.birthDate,
        date: body.date,
        hour: body.hour,
        email: body.email,
        observation: body.observation,
        services: body.services,
        tipoConsult: body.tipoConsult,
        checkBox: body.checkBox
    }

    if (userPayload.checkBox ===! false) {

        
        console.log("ENTRO FORMULARIO")
        

        const schedule = await Schedule.create(userPayload);
        Object.assign(schedule, { checkBox: true });

        await schedule.save();

        await enviarCorreoSolicitud(userPayload.email, schedule._id, doctor.name);

        await enviarCorreoSolicitud(user.email, schedule._id, doctor.name);

        console.log("CORREO ENVIADO");


        res.status(200).json({ status: 'success1', data: null });

    } else {

        console.log("ENTRO SIN FORMULARIO");

    
        const userPayload2 = {
            idDoctor: doctor._id,
            //idUser: user._id,
            name: user.name+" "+user.lastName,
            email: user.email,
            edad: user.birthDate,
            date: body.date,
            hour: body.hour,
            email: user.email,
            observation: body.observation,
            services: body.services,
            tipoConsult: body.tipoConsult,
            checkBox: body.checkBox
        }

        const schedule = await Schedule.create(userPayload2);

        await enviarCorreoSolicitud(user.email, schedule._id, doctor.name);

        res.status(200).json({ status: 'success2', data: null });

    }

    
    

    
  } catch (err) {
    next(err);
  }
};

const ReviewDoctor = async(req, res, next) => {

    try {
        const { body } = req;

        req.isRole('user');

        const userId = req.user;
        const user = await Client.findById({ _id: userId.id });
        console.log("userID: ", user);

        let review = new ReviewSchema({
            name: user.name,
            idDoctor: req.params._id,
            comment: body.comment,
        });

        review = await review.save();
        console.log("REVIEW: ", review);

        if (!review) {
            throw new ApiError("Review cannot be created", 400);
        }

        res.status(200).json(review);
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
    clientSignup,
    GetServices,
    ProfileDoctor,
    ReviewDoctor,
    AgendarCita,
    getAppointmentsByDoctorId
};