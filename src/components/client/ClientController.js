const Client = require('./ClientModel');
const Doctor = require('../doctor/DoctorModel');
const bcrypt = require("bcryptjs");
const ApiError = require('../../utils/ApiError');
const UserSerializer = require('../../Serializers/UserSerializer');
//const DoctorsSerializer = require('../../Serializers/DoctorsSerializer');
const ReviewSchema = require('./ReviewModel');
const ConsultModel = require('../doctor/ConsultModel');

const consultModel = require('../doctor/ConsultModel');
const ConsultSerializer = require('../../Serializers/ConsultSerializer');

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

            throw new ApiError("Datos inválidos", 500);

        }

        doctor.forEach(async(doc) => {
            await consultModel.find({ name: doc.name }).then((profileSearch) => {
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


        if (!profileDoctor) return new ApiError("Profile doctor not found", 400);



        res.status(200).json(profileDoctor);

    } catch (err) {
        next(err);
    }
};

const AgendarCita = async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user;
    if (body.name === undefined) {
      throw new ApiError('error', 400);
    }
    const user = await Client.findOne({ _id:  userId });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const emailUser = user.email;

    //await user.update({ token: user.token });
    await enviarCorreoRecuperacion(emailUser, user._id);

    res.json({ status: 'success', data: null });
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

module.exports = {
    clientSignup,
    GetServices,
    ProfileDoctor,
    ReviewDoctor,
    AgendarCita
};