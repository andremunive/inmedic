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
        console.log("doctor: "+doctor)
        doctor.forEach(async(doc) => {
            await ConsultModel.find({ idDoctor: doc._id}).then((profileSearch) => {
                resultConsults = [...resultConsults, ...profileSearch];
                myIndex += 1;
                console.log("profileDoctor: ", resultConsults);

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

    edadUser = calcular_edad(body.age);
    console.log("edad: ",edadUser);
    

    const userPayload = {
        idDoctor: doctor._id,
        idClient: user._id,
        name: body.name,
        DocumentNumber: body.DocumentNumber,
        age: edadUser,
        date: body.date,
        hour: body.hour,
        email: body.email,
        observation: body.observation,
        services: body.services,
        tipoConsult: body.tipoConsult,
        checkBox: body.checkBox
    }

    if (userPayload.checkBox ===! false) {

        if (Object.values(userPayload).some((val) => val === "")) {
            throw new ApiError("Complete all fields", 200);

        } 

        
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
            idClient: user._id,
            name: user.name+" "+user.lastName,
            email: user.email,
            age: user.birthDate,
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

//calcular la edad de una persona
//recibe la fecha como un string en formato español
//devuelve un entero con la edad. Devuelve false en caso de que la fecha sea incorrecta o mayor que el dia actual
function calcular_edad(fecha){

    //calculo la fecha de hoy
    hoy=new Date()

    console.log("Fecha de hoy: ",hoy);
    //alert(hoy)

    //calculo la fecha que recibo
    //La descompongo en un array
    var array_fecha = fecha.split("/")
    console.log("Array_fecha: ", array_fecha);
    //si el array no tiene tres partes, la fecha es incorrecta
    if (array_fecha.length!=3)
       return false

    //compruebo que los ano, mes, dia son correctos
    var ano
    ano = parseInt(array_fecha[2]);
    console.log("AÑO: ",ano);
    if (isNaN(ano))
       return false

    var mes
    console.log("MES: ",mes);
    mes = parseInt(array_fecha[1]);
    if (isNaN(mes))
       return false

    var dia
    console.log("DIA: ",dia);
    dia = parseInt(array_fecha[0]);
    if (isNaN(dia))
       return false


    //si el año de la fecha que recibo solo tiene 2 cifras hay que cambiarlo a 4
    if (ano<=99)
       ano +=1900

    //resto los años de las dos fechas
    edad=hoy.getYear()- ano - 1; //-1 porque no se si ha cumplido años ya este año
    console.log("EDAD: ", edad);

    //si resto los meses y me da menor que 0 entonces no ha cumplido años. Si da mayor si ha cumplido
    if (hoy.getMonth() + 1 - mes < 0) //+ 1 porque los meses empiezan en 0
       return edad
    if (hoy.getMonth() + 1 - mes > 0)
       return edad+1

    //entonces es que eran iguales. miro los dias
    //si resto los dias y me da menor que 0 entonces no ha cumplido años. Si da mayor o igual si ha cumplido
    if (hoy.getUTCDate() - dia >= 0)
       return edad + 1

    return edad
}



module.exports = {
    clientSignup,
    GetServices,
    ProfileDoctor,
    ReviewDoctor,
    AgendarCita,
   
};